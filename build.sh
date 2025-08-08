#!/bin/bash

echo "🏗️ Building Healthcare Web App for Railway..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the app
echo "🔨 Building React app..."
npm run build

# Check if build was successful
if [ -d "build" ]; then
    echo "✅ Build successful! Build directory created."
    ls -la build/
else
    echo "❌ Build failed! No build directory found."
    exit 1
fi

echo "🚀 Ready for deployment!" 