import json
import os
import boto3
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('PRODUCTS_TABLE', 'TechLoopProducts')
table = dynamodb.Table(table_name)

def lambda_handler(event, context):
    try:
        query_params = event.get('queryStringParameters', {}) or {}
        search = query_params.get('search', '').lower()
        category = query_params.get('category', '')
        offer_type = query_params.get('type', '')

        scan_kwargs = {}
        filter_expressions = []
        expression_values = {}

        if category and category != 'Todas':
            filter_expressions.append('category = :cat')
            expression_values[':cat'] = category

        if offer_type and offer_type != 'Todo':
            filter_expressions.append('offer_type = :type')
            expression_values[':type'] = offer_type

        if filter_expressions:
            scan_kwargs['FilterExpression'] = ' AND '.join(filter_expressions)
            scan_kwargs['ExpressionAttributeValues'] = expression_values

        response = table.scan(**scan_kwargs)
        products = response.get('Items', [])

        if search:
            products = [
                p for p in products
                if search in p.get('title', '').lower() or
                   search in p.get('description', '').lower()
            ]

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': json.dumps({'products': products})
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
