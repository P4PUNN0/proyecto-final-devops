import json
import os
import boto3
import uuid
import logging
from datetime import datetime, timezone

# Configure logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Constants
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
}

# DynamoDB configuration
dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('PRODUCTS_TABLE', 'TechLoopProducts')
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    """Create a new product in DynamoDB."""
    try:
        if event.get('httpMethod') == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': CORS_HEADERS,
                'body': json.dumps({})
            }

        body = json.loads(event.get('body', '{}'))
        logger.info(f'Received product creation request: {body}')

        required_fields = ['title', 'category', 'condition', 'offer_type', 'brand', 'model', 'description', 'city', 'seller']
        for field in required_fields:
            if field not in body or not str(body[field]).strip():
                logger.warning(f'Missing or empty required field: {field}')
                return {
                    'statusCode': 400,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({'error': f'{field} is required'})
                }
        
        # Validate price is a number and positive
        try:
            price = float(body.get('price', 0))
            if price < 0:
                logger.warning(f'Invalid price value: {price}')
                return {
                    'statusCode': 400,
                    'headers': CORS_HEADERS,
                    'body': json.dumps({'error': 'price must be a positive number'})
                }
        except (ValueError, TypeError):
            logger.warning(f'Invalid price format: {body.get("price")}')
            return {
                'statusCode': 400,
                'headers': CORS_HEADERS,
                'body': json.dumps({'error': 'price must be a valid number'})
            }

        product_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc).isoformat()

        product = {
            'id': product_id,
            'title': body['title'].strip(),
            'category': body['category'].strip(),
            'condition': body['condition'].strip(),
            'offer_type': body['offer_type'].strip(),
            'brand': body['brand'].strip(),
            'model': body['model'].strip(),
            'description': body['description'].strip(),
            'city': body['city'].strip(),
            'price': price,
            'image_url': body.get('image_url', '').strip(),
            'seller': body['seller'].strip(),
            'created_at': now,
            'updated_at': now
        }

        table.put_item(Item=product)
        logger.info(f'Product created successfully with ID: {product_id}')

        return {
            'statusCode': 201,
            'headers': CORS_HEADERS,
            'body': json.dumps({'message': 'Product created successfully', 'product': product})
        }

    except json.JSONDecodeError:
        logger.error('Invalid JSON in request body')
        return {
            'statusCode': 400,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': 'Invalid JSON in request body'})
        }
    except Exception as e:
        logger.error(f'Unexpected error creating product: {str(e)}', exc_info=True)
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps({'error': 'Internal server error'})
        }
