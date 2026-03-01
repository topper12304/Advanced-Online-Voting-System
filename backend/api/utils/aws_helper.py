"""
AWS Helper Functions
Provides utilities for interacting with AWS services like DynamoDB, Rekognition, etc.
"""

import boto3
from botocore.exceptions import ClientError
from django.conf import settings


class DynamoDBHelper:
    """
    Helper class for DynamoDB operations.
    Provides simple methods to interact with DynamoDB tables.
    """
    
    def __init__(self):
        """
        Initialize DynamoDB client with AWS credentials from settings.
        """
        try:
            # Create DynamoDB resource
            self.dynamodb = boto3.resource(
                'dynamodb',
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID if settings.AWS_ACCESS_KEY_ID else None,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY if settings.AWS_SECRET_ACCESS_KEY else None
            )
            
            # Store table names from settings
            self.tables = {
                'voters': settings.DYNAMODB_VOTERS_TABLE,
                'votes': settings.DYNAMODB_VOTES_TABLE,
                'sessions': settings.DYNAMODB_SESSIONS_TABLE,
                'elections': settings.DYNAMODB_ELECTIONS_TABLE
            }
        except Exception as e:
            print(f"Warning: Could not initialize DynamoDB: {e}")
            self.dynamodb = None
    
    def put_item(self, table_name, item):
        """
        Put an item into a DynamoDB table.
        
        Args:
            table_name (str): Name of the table (voters, votes, sessions, elections)
            item (dict): Item data to store
        
        Returns:
            dict: Response from DynamoDB
        
        Raises:
            Exception: If DynamoDB operation fails
        """
        if not self.dynamodb:
            raise Exception("DynamoDB not initialized")
        
        try:
            # Get table reference
            table = self.dynamodb.Table(self.tables[table_name])
            
            # Put item in table
            response = table.put_item(Item=item)
            return response
        except ClientError as e:
            raise Exception(f"DynamoDB put_item failed: {e.response['Error']['Message']}")
    
    def get_item(self, table_name, key):
        """
        Get an item from a DynamoDB table.
        
        Args:
            table_name (str): Name of the table
            key (dict): Primary key of the item to retrieve
        
        Returns:
            dict: Item data if found, None otherwise
        
        Raises:
            Exception: If DynamoDB operation fails
        """
        if not self.dynamodb:
            raise Exception("DynamoDB not initialized")
        
        try:
            # Get table reference
            table = self.dynamodb.Table(self.tables[table_name])
            
            # Get item from table
            response = table.get_item(Key=key)
            return response.get('Item')
        except ClientError as e:
            raise Exception(f"DynamoDB get_item failed: {e.response['Error']['Message']}")
    
    def query_items(self, table_name, key_condition):
        """
        Query items from a DynamoDB table.
        
        Args:
            table_name (str): Name of the table
            key_condition (dict): Query condition
        
        Returns:
            list: List of items matching the query
        
        Raises:
            Exception: If DynamoDB operation fails
        """
        if not self.dynamodb:
            raise Exception("DynamoDB not initialized")
        
        try:
            # Get table reference
            table = self.dynamodb.Table(self.tables[table_name])
            
            # Query table
            response = table.query(**key_condition)
            return response.get('Items', [])
        except ClientError as e:
            raise Exception(f"DynamoDB query failed: {e.response['Error']['Message']}")


class RekognitionHelper:
    """
    Helper class for Amazon Rekognition operations.
    Provides methods for face detection and verification.
    """
    
    def __init__(self):
        """
        Initialize Rekognition client with AWS credentials.
        """
        try:
            self.rekognition = boto3.client(
                'rekognition',
                region_name=settings.AWS_REGION,
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID if settings.AWS_ACCESS_KEY_ID else None,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY if settings.AWS_SECRET_ACCESS_KEY else None
            )
        except Exception as e:
            print(f"Warning: Could not initialize Rekognition: {e}")
            self.rekognition = None
    
    def compare_faces(self, source_image, target_image, similarity_threshold=90):
        """
        Compare two faces to verify if they match.
        
        Args:
            source_image (bytes): Source image bytes (from database)
            target_image (bytes): Target image bytes (from user upload)
            similarity_threshold (int): Minimum similarity percentage (0-100)
        
        Returns:
            dict: Comparison result with similarity score
        
        Raises:
            Exception: If Rekognition operation fails
        """
        if not self.rekognition:
            raise Exception("Rekognition not initialized")
        
        try:
            # Call Rekognition API to compare faces
            response = self.rekognition.compare_faces(
                SourceImage={'Bytes': source_image},
                TargetImage={'Bytes': target_image},
                SimilarityThreshold=similarity_threshold
            )
            
            # Check if faces match
            if response['FaceMatches']:
                similarity = response['FaceMatches'][0]['Similarity']
                return {
                    'match': True,
                    'similarity': similarity,
                    'confidence': response['FaceMatches'][0]['Face']['Confidence']
                }
            else:
                return {
                    'match': False,
                    'similarity': 0,
                    'confidence': 0
                }
        except ClientError as e:
            raise Exception(f"Rekognition compare_faces failed: {e.response['Error']['Message']}")
    
    def detect_faces(self, image_bytes):
        """
        Detect faces in an image.
        
        Args:
            image_bytes (bytes): Image bytes to analyze
        
        Returns:
            dict: Face detection results
        
        Raises:
            Exception: If Rekognition operation fails
        """
        if not self.rekognition:
            raise Exception("Rekognition not initialized")
        
        try:
            # Call Rekognition API to detect faces
            response = self.rekognition.detect_faces(
                Image={'Bytes': image_bytes},
                Attributes=['ALL']
            )
            
            return {
                'faces_detected': len(response['FaceDetails']),
                'face_details': response['FaceDetails']
            }
        except ClientError as e:
            raise Exception(f"Rekognition detect_faces failed: {e.response['Error']['Message']}")
