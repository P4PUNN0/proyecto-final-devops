import json
import os
import boto3

dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('PRODUCTS_TABLE', 'TechLoopProducts')
table = dynamodb.Table(table_name)

s3 = boto3.client('s3')
bucket_name = os.environ.get('IMAGES_BUCKET', 'techloop-images')

def lambda_handler(event, context):
    try:
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                'body': json.dumps({})
            }

        product_id = event.get('pathParameters', {}).get('id')

        if not product_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Product ID is required'})
            }

        response = table.get_item(Key={'id': product_id})
        product = response.get('Item')

        if not product:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Product not found'})
            }

        if product.get('image_url'):
            try:
                image_key = product['image_url'].split('/')[-1]
                s3.delete_object(Bucket=bucket_name, Key=image_key)
            except Exception as e:
                print(f"Error deleting image: {e}")

        table.delete_item(Key={'id': product_id})

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'message': 'Product deleted successfully'})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)})
        }
