# AWS Deployment Steps

## Prerequisites

1. AWS Account ready hai
2. AWS CLI installed hai
3. EB CLI install karo: `pip install awsebcli`

## Step 1: Configure AWS Credentials (SECURE WAY)

**Terminal mein run karo (keys chat mein mat daalo):**

```bash
aws configure
```

Yeh prompt karega:
- AWS Access Key ID: [Enter your key]
- AWS Secret Access Key: [Enter your secret]
- Default region: us-east-1
- Default output format: json

## Step 2: Initialize Elastic Beanstalk

```bash
cd backend
eb init
```

Prompts:
1. Select region: `us-east-1` (ya jo tumhara region hai)
2. Application name: `voting-system`
3. Platform: `Python 3.9`
4. Do you want to set up SSH: `No`

## Step 3: Create Environment

```bash
eb create voting-system-env
```

Options:
- Environment name: `voting-system-env`
- DNS CNAME prefix: `voting-system` (ya koi unique name)

Yeh 5-10 minutes lega.

## Step 4: Set Environment Variables

```bash
eb setenv DJANGO_SECRET_KEY="your-secret-key-here" DJANGO_DEBUG=False DJANGO_ALLOWED_HOSTS=".elasticbeanstalk.com"
```

## Step 5: Deploy

```bash
eb deploy
```

## Step 6: Get Backend URL

```bash
eb status
```

Output mein "CNAME" dekho, woh tumhara backend URL hoga:
Example: `voting-system.us-east-1.elasticbeanstalk.com`

## Step 7: Test Backend

```bash
curl http://your-backend-url.elasticbeanstalk.com/api/health
```

## Step 8: Update Frontend

Backend URL mil gaya to frontend mein add karo:

```bash
echo "VITE_API_URL=http://your-backend-url.elasticbeanstalk.com/api" > frontend/.env.production
```

## Step 9: Commit & Push

```bash
git add frontend/.env.production
git commit -m "Add production backend URL"
git push origin main
```

GitHub Pages automatically redeploy karega.

---

## Troubleshooting

### Check Logs
```bash
eb logs
```

### SSH into instance
```bash
eb ssh
```

### Redeploy
```bash
eb deploy
```

### Terminate (to stop charges)
```bash
eb terminate voting-system-env
```

---

## Important Notes

1. AWS keys ko KABHI GitHub par push mat karo
2. `.gitignore` mein `.elasticbeanstalk/` already hai
3. Free tier mein 750 hours/month free hai
4. Environment terminate karna mat bhoolna agar use nahi kar rahe
