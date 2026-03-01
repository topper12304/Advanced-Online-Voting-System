# 📁 Project Structure - Simple Explanation

## Complete Project Overview

```
advanced-voting-system/
│
├── frontend/                    # React Application (Browser)
│   ├── src/
│   │   ├── pages/              # .tsx files (TypeScript + React)
│   │   │   ├── HomePage.tsx    # TypeScript + React
│   │   │   ├── LoginPage.tsx
│   │   │   └── VotingPage.tsx
│   │   ├── components/         # .tsx files
│   │   ├── services/           # .ts files (TypeScript)
│   │   └── stores/             # .ts files
│   └── package.json            # Node.js dependencies
│
└── backend/                     # Django Application (Server)
    ├── api/                     # .py files (Python)
    │   ├── views.py            # Python - API endpoints
    │   ├── urls.py             # Python - URL routing
    │   └── utils/
    │       ├── auth_helper.py  # Python - JWT functions
    │       └── aws_helper.py   # Python - AWS functions
    ├── voting_backend/          # .py files (Python)
    │   ├── settings.py         # Python - Configuration
    │   ├── urls.py             # Python - Main routing
    │   └── wsgi.py             # Python - Server
    ├── manage.py               # Python - Django commands
    └── requirements.txt        # Python dependencies
```

---

## File Extensions Explained

### Frontend Files

| Extension | Language | Purpose | Example |
|-----------|----------|---------|---------|
| `.tsx` | TypeScript + React | UI Components | `HomePage.tsx` |
| `.ts` | TypeScript | Logic/Services | `api.ts` |
| `.css` | CSS | Styling | `index.css` |
| `.json` | JSON | Configuration | `package.json` |

### Backend Files

| Extension | Language | Purpose | Example |
|-----------|----------|---------|---------|
| `.py` | Python | Backend Logic | `views.py` |
| `.txt` | Text | Dependencies | `requirements.txt` |

---

## Languages Used

### 1. Frontend (Browser)
**Language:** TypeScript (`.ts`, `.tsx`)
- TypeScript = JavaScript + Types
- Runs in browser
- React framework
- Modern, type-safe

**Why TypeScript?**
- Catches errors before running
- Better code completion
- Industry standard for React

### 2. Backend (Server)
**Language:** Python (`.py`)
- Python 3.9+
- Django framework
- Runs on server (AWS Lambda)

**Why Python?**
- Easy AWS integration (boto3)
- Django is production-ready
- Used by Instagram, Pinterest
- Perfect for AWS services

---

## How They Work Together

```
User Browser
    ↓
Frontend (TypeScript/React)
    ↓ HTTP Requests
Backend (Python/Django)
    ↓
AWS Services (DynamoDB, Rekognition)
```

---

## What You Need to Know

### For Frontend Development:
- **Language:** TypeScript (like JavaScript but safer)
- **Files:** `.ts` and `.tsx`
- **Run:** `npm run dev`
- **Edit:** Any text editor

### For Backend Development:
- **Language:** Python
- **Files:** `.py`
- **Run:** `python manage.py runserver`
- **Edit:** Any text editor

---

## Quick Commands

### Frontend (TypeScript)
```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
```

### Backend (Python)
```bash
cd backend
pip install -r requirements.txt    # Install dependencies
python manage.py runserver         # Start development server
python manage.py migrate           # Setup database
```

---

## For Your Understanding

**TypeScript (.ts, .tsx):**
- Frontend only
- Runs in browser
- Makes UI look good
- Handles user interactions

**Python (.py):**
- Backend only
- Runs on server
- Handles data
- Connects to AWS
- Processes votes

---

## Summary

| Component | Language | Files | Purpose |
|-----------|----------|-------|---------|
| Frontend | TypeScript | `.ts`, `.tsx` | User Interface |
| Backend | Python | `.py` | Server Logic |
| Styling | CSS | `.css` | Design |
| Config | JSON | `.json` | Settings |

**Both work together to make a complete application!**

---

## For PPT

**Technology Stack:**
- **Frontend:** React + TypeScript
- **Backend:** Python + Django
- **Database:** AWS DynamoDB
- **Deployment:** AWS Lambda + Vercel
- **AI/ML:** AWS boto3 (Python SDK)

**Why This Stack?**
- TypeScript: Type-safe frontend
- Python: Easy AWS integration
- Django: Production-ready framework
- AWS: Scalable cloud infrastructure

---

**Simple Answer:**
- `.ts`/`.tsx` = TypeScript (Frontend, Browser)
- `.py` = Python (Backend, Server)
- Both are different languages for different purposes!
