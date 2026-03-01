# 🔧 Install Prerequisites - Windows

## What You Need to Install

1. Python 3.9+
2. AWS CLI
3. Git (already installed ✅)

---

## Step 1: Install Python (10 minutes)

### Download Python

1. Go to: https://www.python.org/downloads/
2. Click "Download Python 3.11.x" (latest version)
3. Run the installer

### IMPORTANT During Installation:

✅ **CHECK "Add Python to PATH"** (Very important!)
✅ Click "Install Now"

### Verify Installation

Open **NEW** Command Prompt and run:
```bash
python --version
```

Should show: `Python 3.11.x`

If not working, try:
```bash
py --version
```

---

## Step 2: Install AWS CLI (5 minutes)

### Download AWS CLI

1. Go to: https://aws.amazon.com/cli/
2. Click "Download for Windows"
3. Download: `AWSCLIV2.msi`
4. Run the installer
5. Click "Next" → "Next" → "Install"

### Verify Installation

Open **NEW** Command Prompt and run:
```bash
aws --version
```

Should show: `aws-cli/2.x.x`

---

## Step 3: Configure AWS (5 minutes)

### Get AWS Credentials

1. Go to: https://console.aws.amazon.com
2. Login to your AWS account
3. Click your name (top right) → Security Credentials
4. Scroll to "Access keys"
5. Click "Create access key"
6. Choose "CLI"
7. Click "Create access key"
8. **SAVE THESE:**
   - Access Key ID: `AKIA...`
   - Secret Access Key: `wJalr...`

### Configure AWS CLI

```bash
aws configure
```

Enter when prompted:
```
AWS Access Key ID: [Paste your Access Key ID]
AWS Secret Access Key: [Paste your Secret Access Key]
Default region name: us-east-1
Default output format: json
```

### Test Configuration

```bash
aws sts get-caller-identity
```

Should show your AWS account details!

---

## Alternative: Use AWS CloudShell (No Installation Needed!)

If you don't want to install anything:

1. Go to: https://console.aws.amazon.com
2. Login
3. Click the CloudShell icon (>_) in top right
4. Wait for shell to load
5. You can run all AWS commands here!

**Note:** You'll still need Python locally for backend development.

---

## Quick Installation Script (Windows PowerShell)

Run PowerShell as Administrator:

```powershell
# Install Chocolatey (package manager)
Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Python
choco install python -y

# Install AWS CLI
choco install awscli -y

# Refresh environment
refreshenv
```

Then verify:
```bash
python --version
aws --version
```

---

## After Installation

### Close and Reopen Terminal

**IMPORTANT:** After installing, close ALL terminal windows and open a new one!

### Verify Everything Works

```bash
# Check Python
python --version

# Check AWS CLI
aws --version

# Check pip (Python package manager)
pip --version
```

All should work now!

---

## Next Steps

Once installed, come back and we'll deploy:

1. ✅ Python installed
2. ✅ AWS CLI installed
3. ✅ AWS configured
4. 🚀 Ready to deploy!

---

## Troubleshooting

### "python is not recognized"

- Reinstall Python
- Make sure "Add to PATH" is checked
- Restart computer

### "aws is not recognized"

- Reinstall AWS CLI
- Restart terminal
- Check: `C:\Program Files\Amazon\AWSCLIV2\aws.exe`

### Still not working?

Use AWS CloudShell (no installation needed):
- Go to AWS Console
- Click CloudShell icon
- Run commands there

---

**Estimated Time:** 20 minutes  
**Difficulty:** Easy  
**Required:** Yes (for deployment)
