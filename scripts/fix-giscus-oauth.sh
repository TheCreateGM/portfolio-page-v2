#!/bin/bash

# Fix Giscus OAuth 404 Error
# This script helps diagnose and fix the "404 NOT_FOUND" error when users try to sign in with GitHub

set -e

echo "🔍 Giscus OAuth Fix Helper"
echo "=========================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local not found!"
    echo "   Copy .env.example to .env.local first"
    exit 1
fi

# Source the environment variables
source .env.local

echo "📋 Current Giscus Configuration:"
echo "--------------------------------"
echo "Repo: $VITE_GISCUS_REPO"
echo "Repo ID: $VITE_GISCUS_REPO_ID"
echo "Category: $VITE_GISCUS_CATEGORY"
echo "Category ID: $VITE_GISCUS_CATEGORY_ID"
echo ""

# Check if required variables are set
MISSING=0
if [ -z "$VITE_GISCUS_REPO" ]; then
    echo "❌ VITE_GISCUS_REPO is not set"
    MISSING=1
fi
if [ -z "$VITE_GISCUS_REPO_ID" ]; then
    echo "❌ VITE_GISCUS_REPO_ID is not set"
    MISSING=1
fi
if [ -z "$VITE_GISCUS_CATEGORY" ]; then
    echo "❌ VITE_GISCUS_CATEGORY is not set"
    MISSING=1
fi
if [ -z "$VITE_GISCUS_CATEGORY_ID" ]; then
    echo "❌ VITE_GISCUS_CATEGORY_ID is not set"
    MISSING=1
fi

if [ $MISSING -eq 1 ]; then
    echo ""
    echo "⚠️  Missing required environment variables!"
    echo ""
    echo "📝 To fix this:"
    echo "1. Go to https://giscus.app"
    echo "2. Enter your repo: $VITE_GISCUS_REPO"
    echo "3. Select a category (e.g., 'Comments' or 'Announcements')"
    echo "4. Copy the data-repo-id and data-category-id from the generated script"
    echo "5. Update your .env.local file"
    echo ""
    exit 1
fi

echo "✅ All required variables are set"
echo ""

# Check if GitHub Discussions is enabled
echo "🔍 Checking GitHub Discussions..."
REPO_URL="https://github.com/$VITE_GISCUS_REPO"
DISCUSSIONS_URL="$REPO_URL/discussions"

echo "   Repository: $REPO_URL"
echo "   Discussions: $DISCUSSIONS_URL"
echo ""

# Check if Giscus app is installed
echo "🔍 Checking Giscus App Installation..."
echo "   Visit: https://github.com/apps/giscus"
echo "   Make sure it's installed for: $VITE_GISCUS_REPO"
echo ""

# Provide next steps
echo "📝 Next Steps to Fix OAuth Error:"
echo "=================================="
echo ""
echo "1. Verify Giscus App is installed:"
echo "   → https://github.com/apps/giscus"
echo "   → Click 'Configure'"
echo "   → Select: $VITE_GISCUS_REPO"
echo ""
echo "2. Verify GitHub Discussions is enabled:"
echo "   → $REPO_URL/settings"
echo "   → Scroll to 'Features'"
echo "   → Check ✅ 'Discussions'"
echo ""
echo "3. Verify the category exists:"
echo "   → $DISCUSSIONS_URL"
echo "   → Look for category: '$VITE_GISCUS_CATEGORY'"
echo "   → If missing, create it"
echo ""
echo "4. Get fresh IDs from giscus.app:"
echo "   → https://giscus.app"
echo "   → Enter repo: $VITE_GISCUS_REPO"
echo "   → Select category: $VITE_GISCUS_CATEGORY"
echo "   → Copy the data-repo-id and data-category-id"
echo ""
echo "5. Update Vercel environment variables:"
echo "   → Go to Vercel dashboard"
echo "   → Settings → Environment Variables"
echo "   → Update VITE_GISCUS_REPO_ID and VITE_GISCUS_CATEGORY_ID"
echo "   → Set for ALL environments (Production, Preview, Development)"
echo ""
echo "6. Redeploy:"
echo "   → git commit --allow-empty -m 'Fix Giscus OAuth'"
echo "   → git push"
echo ""
echo "📚 For detailed instructions, see:"
echo "   → docs/GISCUS_OAUTH_FIX.md"
echo ""
