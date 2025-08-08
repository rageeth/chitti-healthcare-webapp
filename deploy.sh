#!/bin/bash

echo "🚀 Chitti Healthcare Web App Deployment Script"
echo "=============================================="

# Check if GitHub URL is provided
if [ -z "$1" ]; then
    echo "❌ Please provide your GitHub repository URL"
    echo "Usage: ./deploy.sh https://github.com/YOUR_USERNAME/chitti-healthcare-webapp.git"
    echo ""
    echo "📋 Steps to get the URL:"
    echo "1. Go to GitHub.com"
    echo "2. Create new repository: chitti-healthcare-webapp"
    echo "3. Make it public"
    echo "4. Copy the repository URL"
    exit 1
fi

GITHUB_URL=$1

echo "📦 Setting up Git repository..."
git remote add origin $GITHUB_URL
git branch -M main

echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Successfully pushed to GitHub!"
echo ""
echo "🎯 Next Steps:"
echo "1. Go to Railway.app"
echo "2. Click 'New Project'"
echo "3. Select 'Deploy from GitHub repo'"
echo "4. Choose 'chitti-healthcare-webapp'"
echo "5. Add environment variables:"
echo "   - REACT_APP_API_URL=https://chitti-production.up.railway.app"
echo "   - REACT_APP_ENVIRONMENT=production"
echo "   - NODE_ENV=production"
echo ""
echo "🌐 Your web app will be live in minutes!"
echo ""
echo "🔑 Demo Login:"
echo "   Email: demo@hospital.com"
echo "   Password: demo123" 