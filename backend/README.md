# Voting System Backend - Django + AWS

Complete backend API for the Advanced Voting System built with Django and AWS services.

## Technology Stack

- **Framework:** Django 4.2 + Django REST Framework
- **Language:** Python 3.9+
- **Database:** SQLite (dev) / DynamoDB (production)
- **Cloud:** AWS Lambda + API Gateway
- **Authentication:** JWT tokens
- **AI/ML:** AWS Rekognition, Bedrock, SageMaker (planned)

## Features

- JWT-based authentication
- Biometric verification (mock + AWS Rekognition ready)
- Vote recording with blockchain simulation
- Cryptographic receipt generation
- Admin dashboard APIs
- DynamoDB integration
- AWS Lambda deployment ready

## Quick Start (Local Development)

### 1. Install Python Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Set Up Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env and add your AWS credentials
```

### 3. Run Database Migrations

```bash
python manage.py migrate
```

### 4. Start Development Server

```bash
python manage.py runserver 0.0.0.0:8000
```

Server will run on `http://localhost:8000`

### 5. Test the API

```bash
# Health check
curl http://localhost:8000/api/health/

# Login
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"voterId":"VOTER12345"}'
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login with voter ID
- `POST /api/auth/verify-biometric/` - Verify biometric data
- `GET /api/auth/election/current/` - Get current election

### Voting
- `POST /api/voting/cast/` - Cast a vote (requires JWT)
- `GET /api/voting/verify/<receipt_id>/` - Verify vote receipt
- `GET /api/voting/stats/` - Get voting statistics (requires JWT)

### Admin
- `GET /api/admin/dashboard/stats/` - Get dashboard statistics
- `GET /api/admin/votes/recent/` - Get recent votes
- `GET /api/admin/logs/` - Get system logs

## Demo Credentials

For testing:
- Voter ID: `VOTER12345` (Rahul Kumar)
- Voter ID: `VOTER67890` (Priya Sharma)
- Voter ID: `TEST123` (Test User)

## AWS Deployment

### Option 1: AWS Lambda with Zappa (Recommended)

```bash
# Install Zappa
pip install zappa

# Initialize Zappa
zappa init

# Deploy to AWS
zappa deploy dev

# Update deployment
zappa update dev

# View logs
zappa tail dev
```

### Option 2: AWS Elastic Beanstalk

```bash
# Install EB CLI
pip install awsebcli

# Initialize EB
eb init

# Create environment
eb create voting-backend-env

# Deploy
eb deploy
```

### Option 3: AWS EC2 with Gunicorn

```bash
# Install Gunicorn
pip install gunicorn

# Run with Gunicorn
gunicorn voting_backend.wsgi:application --bind 0.0.0.0:8000
```

## AWS Services Integration

### DynamoDB Setup

```bash
# Create tables using AWS CLI
aws dynamodb create-table \
    --table-name voting-system-voters \
    --attribute-definitions AttributeName=voterId,AttributeType=S \
    --key-schema AttributeName=voterId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

aws dynamodb create-table \
    --table-name voting-system-votes \
    --attribute-definitions AttributeName=voteId,AttributeType=S \
    --key-schema AttributeName=voteId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

aws dynamodb create-table \
    --table-name voting-system-sessions \
    --attribute-definitions AttributeName=sessionId,AttributeType=S \
    --key-schema AttributeName=sessionId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST

aws dynamodb create-table \
    --table-name voting-system-elections \
    --attribute-definitions AttributeName=electionId,AttributeType=S \
    --key-schema AttributeName=electionId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST
```

### AWS Rekognition Integration

The backend is ready for AWS Rekognition integration. To enable:

1. Ensure AWS credentials are set in `.env`
2. Uncomment Rekognition code in `api/views.py`
3. Upload voter photos to S3
4. Call `RekognitionHelper.compare_faces()` in biometric verification

## Project Structure

```
backend/
├── voting_backend/          # Django project settings
│   ├── settings.py         # Main configuration
│   ├── urls.py             # URL routing
│   └── wsgi.py             # WSGI application
├── api/                     # Main API application
│   ├── views.py            # API endpoint handlers
│   ├── urls.py             # API URL routing
│   └── utils/              # Utility functions
│       ├── auth_helper.py  # JWT authentication
│       └── aws_helper.py   # AWS service helpers
├── manage.py               # Django management script
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Environment Variables

Required environment variables in `.env`:

```env
# Django
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=*

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# DynamoDB Tables
DYNAMODB_VOTERS_TABLE=voting-system-voters
DYNAMODB_VOTES_TABLE=voting-system-votes
DYNAMODB_SESSIONS_TABLE=voting-system-sessions
DYNAMODB_ELECTIONS_TABLE=voting-system-elections

# JWT
JWT_SECRET=your-jwt-secret-key

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## Testing

```bash
# Run tests
python manage.py test

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

## Production Checklist

- [ ] Set `DEBUG=False` in settings
- [ ] Set proper `ALLOWED_HOSTS`
- [ ] Use environment variables for secrets
- [ ] Set up DynamoDB tables
- [ ] Configure AWS credentials
- [ ] Set up CloudWatch logging
- [ ] Enable HTTPS
- [ ] Set up monitoring and alerts

## Cost Estimate

Monthly cost for 10,000 voters:
- AWS Lambda: $0.20
- API Gateway: $3.50
- DynamoDB: $1.25
- Total: ~$5/month

## Support

For issues or questions:
- Check Django logs: `python manage.py runserver`
- Check AWS CloudWatch logs
- Verify AWS credentials
- Test DynamoDB connection

## License

MIT License
