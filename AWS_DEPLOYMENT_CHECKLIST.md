# ✅ AWS Deployment Checklist - Do This in Order!

## 📋 Pre-Deployment (15 min)

### Account Setup
- [ ] AWS account created/logged in
- [ ] $100 credit applied
- [ ] IAM user created
- [ ] Access Key ID saved
- [ ] Secret Access Key saved
- [ ] Credentials CSV downloaded

### Tools Installation
- [ ] Python 3.9+ installed (`python --version`)
- [ ] AWS CLI installed (`aws --version`)
- [ ] AWS CLI configured (`aws configure`)
- [ ] Vercel CLI installed (`vercel --version`)

### Verify Setup
```bash
# Test AWS connection
aws sts get-caller-identity
# Should show your account info
```

---

## 🗄️ Database Setup (10 min)

### Create DynamoDB Tables

```bash
# Copy-paste these commands one by one:

# Table 1: Voters
aws dynamodb create-table --table-name voting-system-voters --attribute-definitions AttributeName=voterId,AttributeType=S --key-schema AttributeName=voterId,KeyType=HASH --billing-mode PAY_PER_REQUEST --region us-east-1

# Table 2: Votes
aws dynamodb create-table --table-name voting-system-votes --attribute-definitions AttributeName=voteId,AttributeType=S --key-schema AttributeName=voteId,KeyType=HASH --billing-mode PAY_PER_REQUEST --region us-east-1

# Table 3: Sessions
aws dynamodb create-table --table-name voting-system-sessions --attribute-definitions AttributeName=sessionId,AttributeType=S --key-schema AttributeName=sessionId,KeyType=HASH --billing-mode PAY_PER_REQUEST --region us-east-1

# Table 4: Elections
aws dynamodb create-table --table-name voting-system-elections --attribute-definitions AttributeName=electionId,AttributeType=S --key-schema AttributeName=electionId,KeyType=HASH --billing-mode PAY_PER_REQUEST --region us-east-1
```

### Verify Tables
```bash
aws dynamodb list-tables --region us-east-1
```

**Expected output:**
```json
{
    "TableNames": [
        "voting-system-elections",
        "voting-system-sessions",
        "voting-system-voters",
        "voting-system-votes"
    ]
}
```

- [ ] All 4 tables created
- [ ] Tables visible in AWS Console

---

## 🐍 Backend Deployment (20 min)

### Setup Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
pip install zappa
```

- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] Zappa installed

### Configure Environment

Create `backend/.env`:
```env
DJANGO_SECRET_KEY=change-this-to-random-string
DEBUG=False
ALLOWED_HOSTS=*

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=YOUR_ACCESS_KEY_HERE
AWS_SECRET_ACCESS_KEY=YOUR_SECRET_KEY_HERE

DYNAMODB_VOTERS_TABLE=voting-system-voters
DYNAMODB_VOTES_TABLE=voting-system-votes
DYNAMODB_SESSIONS_TABLE=voting-system-sessions
DYNAMODB_ELECTIONS_TABLE=voting-system-elections

JWT_SECRET=another-random-string

CORS_ALLOWED_ORIGINS=http://localhost:3000
```

- [ ] .env file created
- [ ] AWS credentials added
- [ ] All variables set

### Deploy to Lambda

```bash
# Initialize Zappa
zappa init
# Press Enter for all defaults

# Deploy
zappa deploy dev
```

**Wait 5-10 minutes...**

**Expected output:**
```
Deploying API Gateway...
Deployment complete!
Your API URL: https://abc123xyz.execute-api.us-east-1.amazonaws.com/dev
```

- [ ] Deployment successful
- [ ] API URL received
- [ ] API URL saved

### Test Backend

```bash
# Replace YOUR-API-URL with your actual URL
curl https://YOUR-API-URL/dev/api/health/
```

**Expected response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00",
  "service": "voting-system-api"
}
```

- [ ] Health check works
- [ ] Backend responding

---

## 🎨 Frontend Deployment (10 min)

### Update API URL

Create `frontend/.env`:
```env
VITE_API_URL=https://YOUR-API-URL.execute-api.us-east-1.amazonaws.com/dev/api
```

Replace `YOUR-API-URL` with your Lambda URL!

- [ ] .env file created
- [ ] API URL updated

### Deploy to Vercel

```bash
cd frontend

# Login
vercel login

# Deploy
vercel --prod
```

**Expected output:**
```
✅ Production: https://voting-system-xyz.vercel.app
```

- [ ] Deployment successful
- [ ] Frontend URL received
- [ ] Frontend URL saved

### Update CORS

Add your Vercel URL to `backend/.env`:
```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://voting-system-xyz.vercel.app
```

Then update backend:
```bash
cd backend
zappa update dev
```

- [ ] CORS updated
- [ ] Backend redeployed

---

## 🧪 Testing (10 min)

### Test Backend APIs

```bash
# 1. Health check
curl https://YOUR-API-URL/dev/api/health/

# 2. Login
curl -X POST https://YOUR-API-URL/dev/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"voterId":"VOTER12345"}'

# 3. Get election
curl https://YOUR-API-URL/dev/api/auth/election/current/
```

- [ ] Health check works
- [ ] Login returns sessionId
- [ ] Election data returns

### Test Frontend

1. Open your Vercel URL in browser
2. Click "Get Started"
3. Enter: `VOTER12345`
4. Complete voting flow
5. Check receipt

- [ ] Frontend loads
- [ ] Can login
- [ ] Can vote
- [ ] Receipt generated
- [ ] No console errors

---

## 📊 Verification (5 min)

### Check DynamoDB

```bash
# Check if vote was recorded
aws dynamodb scan --table-name voting-system-votes --region us-east-1
```

- [ ] Vote visible in DynamoDB
- [ ] Data structure correct

### Check Costs

Go to: AWS Console → Billing Dashboard

- [ ] Current charges: $0-2
- [ ] Within free tier
- [ ] No unexpected charges

---

## 📝 Save URLs for Submission

### Your Deployment URLs:

```
Frontend: https://_____________________.vercel.app
Backend:  https://_____________________.execute-api.us-east-1.amazonaws.com/dev
GitHub:   https://github.com/___________________
```

- [ ] All URLs saved
- [ ] URLs tested
- [ ] URLs work from different devices

---

## 🎥 Demo Preparation

### Screenshots to Take:

- [ ] Frontend homepage
- [ ] Login page
- [ ] Voting page
- [ ] Receipt page
- [ ] Admin dashboard
- [ ] AWS Lambda console
- [ ] DynamoDB tables
- [ ] API Gateway

### Video Recording:

- [ ] Complete voting flow
- [ ] Show backend API calls (Postman/curl)
- [ ] Show AWS console
- [ ] Show DynamoDB data

---

## 🚨 Common Issues & Solutions

### Issue: "zappa command not found"
```bash
pip install zappa
# or
python -m pip install zappa
```

### Issue: "Access Denied" errors
```bash
# Reconfigure AWS CLI
aws configure
# Enter your credentials again
```

### Issue: Frontend can't connect to backend
```bash
# Check CORS in backend/.env
# Make sure Vercel URL is in CORS_ALLOWED_ORIGINS
# Update backend:
zappa update dev
```

### Issue: DynamoDB errors
```bash
# Check tables exist
aws dynamodb list-tables

# Check AWS credentials in backend/.env
```

---

## ✅ Final Checklist

### Before Submission:

- [ ] Backend deployed and working
- [ ] Frontend deployed and working
- [ ] Complete voting flow tested
- [ ] All URLs saved
- [ ] Screenshots taken
- [ ] Demo video recorded
- [ ] GitHub updated
- [ ] PPT created
- [ ] Cost verified (<$10)

### Submission Package:

- [ ] Live frontend URL
- [ ] Live backend URL
- [ ] GitHub repository URL
- [ ] Demo video (YouTube)
- [ ] PPT (PDF)
- [ ] Project summary

---

## 🎉 Success!

**You've successfully deployed:**
- ✅ Django backend on AWS Lambda
- ✅ DynamoDB database (4 tables)
- ✅ React frontend on Vercel
- ✅ Complete working system
- ✅ Production-ready architecture

**Total time:** 1-2 hours  
**Total cost:** $5-10/month  
**Your $100 credit:** Will last 10-20 months!

---

## 📞 Quick Help

**If stuck, check:**
1. AWS credentials configured correctly
2. Python version 3.9+
3. All dependencies installed
4. .env files created
5. CORS settings correct

**View logs:**
```bash
zappa tail dev
```

**Redeploy:**
```bash
zappa update dev
```

---

Good luck! 🚀
