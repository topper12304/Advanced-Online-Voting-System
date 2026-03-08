# Backend Deployment Guide

## Option 1: Deploy to Render.com (Recommended - Free & Easy)

### Steps:

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select this repository

3. **Configure Service**
   - Name: `voting-system-backend`
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn voting_backend.wsgi:application --bind 0.0.0.0:$PORT`

4. **Add Environment Variables**
   ```
   DJANGO_SECRET_KEY=your-secret-key-here
   DJANGO_DEBUG=False
   DJANGO_ALLOWED_HOSTS=*.onrender.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy your backend URL (e.g., https://voting-system-backend.onrender.com)

6. **Update Frontend**
   - Add backend URL to `frontend/.env.production`:
   ```
   VITE_API_URL=https://voting-system-backend.onrender.com/api
   ```

---

## Option 2: Deploy to Railway.app (Alternative - Also Free)

### Steps:

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Set root directory to `backend`
6. Railway will auto-detect Django and deploy

---

## Option 3: AWS Elastic Beanstalk (Production)

### Prerequisites:
- AWS Account
- AWS CLI installed
- EB CLI installed: `pip install awsebcli`

### Steps:

1. **Initialize EB**
   ```bash
   cd backend
   eb init -p python-3.9 voting-system
   ```

2. **Create Environment**
   ```bash
   eb create voting-system-env
   ```

3. **Deploy**
   ```bash
   eb deploy
   ```

4. **Get URL**
   ```bash
   eb status
   ```

---

## Testing Backend

After deployment, test these endpoints:

1. Health Check:
   ```
   GET https://your-backend-url/api/health
   ```

2. Get Election:
   ```
   GET https://your-backend-url/api/auth/election/current
   ```

3. Login:
   ```
   POST https://your-backend-url/api/auth/login
   Body: {"voterId": "VOTER12345"}
   ```

---

## Update Frontend After Backend Deployment

1. Create `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-backend-url/api
   ```

2. Commit and push:
   ```bash
   git add frontend/.env.production
   git commit -m "Add production backend URL"
   git push origin main
   ```

3. GitHub Pages will auto-redeploy with new backend URL
