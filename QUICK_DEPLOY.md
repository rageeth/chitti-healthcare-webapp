# 🚀 Quick Railway Deployment Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com)
2. Click "New repository"
3. Name it: `chitti-healthcare-webapp`
4. Make it public
5. Don't initialize with README (we already have one)

## Step 2: Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/chitti-healthcare-webapp.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `chitti-healthcare-webapp` repository
5. Railway will automatically detect it's a React app

## Step 4: Configure Environment Variables

In Railway dashboard, add these environment variables:

```env
REACT_APP_API_URL=https://chitti-production.up.railway.app
REACT_APP_ENVIRONMENT=production
NODE_ENV=production
```

## Step 5: Deploy

Railway will automatically:
1. Install dependencies (`npm install`)
2. Build the app (`npm run build`)
3. Start the server (`npx serve -s build -l $PORT`)

## Step 6: Access Your App

Railway will provide a URL like:
`https://chitti-healthcare-webapp-production.up.railway.app`

## Demo Login

Use these credentials to test:
- **Email**: `demo@hospital.com`
- **Password**: `demo123`

---

**Your Healthcare Web App will be live in minutes! 🎉** 