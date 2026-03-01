# 🚀 Complete AWS Setup Guide - Step by Step

## Budget: $100 AWS Credits
## Time: 1-2 hours
## Cost: ~$5-10/month (well within budget!)

---

## 📋 What We'll Deploy

1. ✅ **Backend API** → AWS Lambda + API Gateway
2. ✅ **Database** → DynamoDB (4 tables)
3. ✅ **Frontend** → Vercel (free)
4. ✅ **Monitoring** → CloudWatch (included)

**Total Monthly Cost: $5-10** (Your $100 will last 10-20 months!)

---

## 🎯 STEP 1: AWS Account Setup (10 min)

### 1.1 Create/Login to AWS Account
1. Go to https://aws.amazon.com
2. Sign in or create account
3. Apply your $100 credit code

### 1.2 Create IAM User (Security Best Practice)

```bash
# Go to AWS Console → IAM → Users → Create User

Name: voting-system-admin
Access: Programmatic access + AWS Management Console

Permissions: Attach existing policies directly
- AdministratorAccess (for hackathon only)

# Download credentials CSV file!
# You'll get:
# - Access Key ID
# - Secret Access Key
```

**⚠️ IMPORTANT: Save these credentials securely!**

---

## 🎯 STEP 2: Install Required Tools (15 min)

### 2.1 Install Python (if not installed)

**Windows:**
```bash
# Download from python.org
# Version: Python 3.9 or higher
# During installation: Check "Add Python to PATH"

# Verify installation
python --version
# or
py --version
```

**Mac:**
```bash
brew install python@3.9
```

**Linux:**
```bash
sudo apt update
sudo apt install python3.9 python3-pip
```

### 2.2 Install AWS CLI

**Windows:**
```bash
# Download from: https://aws.amazon.com/cli/
# Run installer
# Verify:
aws --version
```

**Mac:**
```bash
brew install awscli
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### 2.3 Configure AWS CLI

```bash
aws configure

# Enter when prompted:
AWS Access Key ID: [Your Access Key from Step 1.2]
AWS Secret Access Key: [Your Secret Key from Step 1.2]
Default region name: us-east-1
Default output format: json
```

**Verify configuration:**
```bash
aws sts get-caller-identity
# Should show your account details
```

---

## 🎯 STEP 3: Create DynamoDB Tables (10 min)

### 3.1 Create Voters Table

```bash
aws dynamodb create-table \
    --table-name voting-system-voters \
    --attribute-definitions AttributeName=voterId,AttributeType=S \
    --key-schema AttributeName=voterId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### 3.2 Create Votes Table

```bash
aws dynamodb create-table \
    --table-name voting-system-votes \
    --attribute-definitions AttributeName=voteId,AttributeType=S \
    --key-schema AttributeName=voteId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### 3.3 Create Sessions Table

```bash
aws dynamodb create-table \
    --table-name voting-system-sessions \
    --attribute-definitions AttributeName=sessionId,AttributeType=S \
    --key-schema AttributeName=sessionId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

### 3.4 Create Elections Table

```bash
aws dynamodb create-table \
    --table-name voting-system-elections \
    --attribute-definitions AttributeName=electionId,AttributeType=S \
    --key-schema AttributeName=electionId,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --region us-east-1
```

**Verify tables created:**
```bash
aws dynamodb list-tables --region us-east-1
```

You should see all 4 tables listed!

---

## 🎯 STEP 4: Deploy Backend to AWS Lambda (20 min)

### 4.1 Install Zappa (Lambda Deployment Tool)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Install Zappa
pip install zappa
```

### 4.2 Create .env File

```bash
# Create backend/.env file with:

DJANGO_SECRET_KEY=your-secret-key-$(openssl rand -hex 32)
DEBUG=False
ALLOWED_HOSTS=*

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-here
AWS_SECRET_ACCESS_KEY=your-secret-key-here

DYNAMODB_VOTERS_TABLE=voting-system-voters
DYNAMODB_VOTES_TABLE=voting-system-votes
DYNAMODB_SESSIONS_TABLE=voting-system-sessions
DYNAMODB_ELECTIONS_TABLE=voting-system-elections

JWT_SECRET=your-jwt-secret-$(openssl rand -hex 32)

CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-url.vercel.app
```

### 4.3 Initialize Zappa

```bash
zappa init

# Answer prompts:
# Environment: dev
# S3 bucket: Press Enter (auto-create)
# Settings file: voting_backend.settings
# Press Enter for remaining defaults
```

### 4.4 Update zappa_settings.json

Edit `backend/zappa_settings.json`:

```json
{
    "dev": {
        "django_settings": "voting_backend.settings",
        "s3_bucket": "zappa-voting-system-deployments",
        "aws_region": "us-east-1",
        "runtime": "python3.9",
        "timeout_seconds": 30,
        "memory_size": 512,
        "keep_warm": false,
        "environment_variables": {
            "DJANGO_SETTINGS_MODULE": "voting_backend.settings"
        }
    }
}
```

### 4.5 Deploy to AWS Lambda

```bash
# First deployment
zappa deploy dev

# This will take 5-10 minutes
# You'll get output like:
# Deploying API Gateway...
# Deployment complete!
# Your API URL: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev
```

**🎉 COPY THIS URL! This is your backend API!**

### 4.6 Test Backend API

```bash
# Test health endpoint
curl https://YOUR-API-URL/dev/api/health/

# Should return:
# {"status":"healthy","timestamp":"...","service":"voting-system-api"}
```

**If deployment successful, you'll see:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00",
  "service": "voting-system-api",
  "version": "1.0.0"
}
```

---

## 🎯 STEP 5: Deploy Frontend to Vercel (10 min)

### 5.1 Update Frontend API URL

Create `frontend/.env`:

```env
VITE_API_URL=https://YOUR-API-URL.execute-api.us-east-1.amazonaws.com/dev/api
```

Replace `YOUR-API-URL` with the URL from Step 4.5!

### 5.2 Install Vercel CLI

```bash
npm install -g vercel
```

### 5.3 Deploy to Vercel

```bash
cd frontend

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Answer prompts:
# Set up and deploy? Yes
# Which scope? Your account
# Link to existing project? No
# Project name? advanced-voting-system
# Directory? ./
# Override settings? No

# Wait for deployment...
# You'll get: https://advanced-voting-system.vercel.app
```

**🎉 COPY THIS URL! This is your frontend!**

---

## 🎯 STEP 6: Test Complete System (10 min)

### 6.1 Test Backend APIs

```bash
# 1. Health check
curl https://YOUR-API-URL/dev/api/health/

# 2. Login
curl -X POST https://YOUR-API-URL/dev/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"voterId":"VOTER12345"}'

# Should return sessionId

# 3. Get current election
curl https://YOUR-API-URL/dev/api/auth/election/current/

# Should return election with candidates
```

### 6.2 Test Frontend

1. Open your Vercel URL in browser
2. Click "Get Started"
3. Enter Voter ID: `VOTER12345`
4. Complete voting flow
5. Check receipt generation

**✅ If everything works, you're DONE!**

---

## 🎯 STEP 7: Monitor & Manage (Ongoing)

### 7.1 View Lambda Logs

```bash
# View logs
zappa tail dev

# Or in AWS Console:
# CloudWatch → Log Groups → /aws/lambda/voting-system-api-dev
```

### 7.2 Check DynamoDB Data

```bash
# Scan votes table
aws dynamodb scan --table-name voting-system-votes --region us-east-1

# Count items
aws dynamodb scan --table-name voting-system-votes --select COUNT --region us-east-1
```

### 7.3 Monitor Costs

```bash
# AWS Console → Billing Dashboard
# Check current month charges
# Should be $0-5 with free tier
```

---

## 💰 Cost Breakdown

| Service | Free Tier | After Free Tier | Your Cost |
|---------|-----------|-----------------|-----------|
| Lambda | 1M requests/month | $0.20/1M | $0-1 |
| API Gateway | 1M requests/month | $3.50/1M | $0-3 |
| DynamoDB | 25GB + 25 WCU/RCU | $1.25/GB | $0-2 |
| CloudWatch | 10 metrics | $0.30/metric | $0-1 |
| S3 (Zappa) | 5GB | $0.023/GB | $0-1 |
| **TOTAL** | | | **$0-8/month** |

**Your $100 credit will last 12+ months!**

---

## 🆘 Troubleshooting

### Backend deployment fails?

```bash
# Check Python version
python --version  # Should be 3.9+

# Reinstall dependencies
pip install -r requirements.txt

# Check AWS credentials
aws sts get-caller-identity

# Redeploy
zappa update dev
```

### Frontend can't connect to backend?

```bash
# Check CORS settings in backend/voting_backend/settings.py
# Add your Vercel URL to CORS_ALLOWED_ORIGINS

# Update backend
zappa update dev
```

### DynamoDB errors?

```bash
# Check tables exist
aws dynamodb list-tables

# Check AWS credentials in .env
# Make sure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are set
```

---

## 📊 For Your Submission

### Live URLs to Submit:

1. **Frontend:** `https://your-app.vercel.app`
2. **Backend API:** `https://your-api.execute-api.us-east-1.amazonaws.com/dev`
3. **GitHub:** Your repository URL

### Demo Credentials:

- Voter ID: `VOTER12345`
- Voter ID: `VOTER67890`
- Voter ID: `TEST123`

### Architecture Diagram:

```
User Browser
    ↓
Vercel (Frontend)
    ↓ HTTPS
AWS API Gateway
    ↓
AWS Lambda (Django Backend)
    ↓
DynamoDB (4 Tables)
```

---

## ✅ Deployment Checklist

- [ ] AWS account created
- [ ] IAM user created with credentials
- [ ] AWS CLI installed and configured
- [ ] Python 3.9+ installed
- [ ] DynamoDB tables created (4 tables)
- [ ] Backend deployed to Lambda
- [ ] Backend API tested
- [ ] Frontend .env updated with API URL
- [ ] Frontend deployed to Vercel
- [ ] Complete flow tested
- [ ] URLs saved for submission

---

## 🎉 Success Criteria

**You're successful when:**

1. ✅ Backend API responds to health check
2. ✅ Login API returns session ID
3. ✅ Frontend loads on Vercel
4. ✅ Can complete voting flow
5. ✅ Vote is recorded in DynamoDB
6. ✅ Receipt is generated

---

## 📞 Quick Commands Reference

```bash
# Deploy backend
cd backend
zappa deploy dev

# Update backend
zappa update dev

# View logs
zappa tail dev

# Deploy frontend
cd frontend
vercel --prod

# Check DynamoDB
aws dynamodb list-tables

# Check costs
aws ce get-cost-and-usage --time-period Start=2024-01-01,End=2024-01-31 --granularity MONTHLY --metrics BlendedCost
```

---

## 🚀 Next Steps After Deployment

1. **Test thoroughly** - Complete voting flow multiple times
2. **Take screenshots** - For PPT and documentation
3. **Record demo video** - Show working system
4. **Update GitHub** - Push all code
5. **Prepare submission** - URLs, PPT, video

---

**Estimated Time: 1-2 hours**  
**Difficulty: Medium**  
**Cost: $5-10/month**  
**Success Rate: High (if you follow steps)**

Good luck! 🎉
