import json
import os
import boto3
import uuid
from datetime import datetime

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

        body = json.loads(event.get('body', '{}'))

        required_fields = ['title', 'category', 'condition', 'offer_type', 'brand', 'model', 'description', 'city']
        for field in required_fields:
            if field not in body or not body[field]:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': f'{field} is required'})
                }

        product_id = str(uuid.uuid4())
        now = datetime.utcnow().isoformat()

        product = {
            'id': product_id,
            'title': body['title'],
            'category': body['category'],
            'condition': body['condition'],
            'offer_type': body['offer_type'],
            'brand': body['brand'],
            'model': body['model'],
            'description': body['description'],
            'city': body['city'],
            'price': body.get('price', 0),
            'image_url': body.get('image_url', ''),
            'seller': body.get('seller', 'Anonymous'),
            'created_at': now,
            'updated_at': now
        }

        table.put_item(Item=product)

        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'message': 'Product created successfully', 'product': product})
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
