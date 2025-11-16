#!/bin/bash

# Fix Vercel Giscus 404 Error
# This script helps you deploy the fix for Giscus OAuth 404 errors

set -e

echo "🔧 Fixing Vercel Giscus 404 Error"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "vercel.json" ]; then
    echo "❌ Error: vercel.json not found. Are you in the project root?"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local not found. Please create it from .env.example"
    exit 1
fi

# Verify VITE_GISCUS_ORIGIN is set correctly
GISCUS_ORIGIN=$(grep "VITE_GISCUS_ORIGIN" .env.local | cut -d '=' -f2)
if [[ "$GISCUS_ORIGIN" == *"/giscus-callback"* ]]; then
    echo "⚠️  Warning: VITE_GISCUS_ORIGIN should NOT include /giscus-callback"
    echo "   Current value: $GISCUS_ORIGIN"
    echo ""
    read -p "   Fix this automatically? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        BASE_URL=$(echo "$GISCUS_ORIGIN" | sed 's|/giscus-callback||')
        sed -i.bak "s|VITE_GISCUS_ORIGIN=.*|VITE_GISCUS_ORIGIN=${BASE_URL}|" .env.local
        rm .env.local.bak 2>/dev/null || true
        echo "✅ Updated VITE_GISCUS_ORIGIN in .env.local"
    fi
fi

echo ""
echo "📋 Checklist:"
echo "============="
echo ""
echo "✅ 1. Updated vercel.json with explicit blog post rewrites"
echo "✅ 2. Verified VITE_GISCUS_ORIGIN in .env.local"
echo ""
echo "⚠️  3. You need to update Vercel environment variables:"
echo "   - Go to: https://vercel.com/your-project/settings/environment-variables"
echo "   - Set VITE_GISCUS_ORIGIN to: https://axogm.vercel.app"
echo "   - Make sure it's set for Production, Preview, and Development"
echo ""
echo "📦 4. Deploy to Vercel:"
echo ""
echo "   Option A - Git push (recommended):"
echo "   $ git add vercel.json .env.local docs/"
echo "   $ git commit -m 'fix: Update Vercel rewrites for Giscus OAuth'"
echo "   $ git push"
echo ""
echo "   Option B - Manual redeploy:"
echo "   - Go to Vercel dashboard"
echo "   - Click 'Deployments'"
echo "   - Click '...' on latest deployment"
echo "   - Click 'Redeploy'"
echo ""
echo "🧪 5. Test the fix:"
echo "   - Visit: https://axogm.vercel.app/blog/welcome-to-my-portfolio"
echo "   - Click 'Sign in with GitHub' in comments"
echo "   - Complete OAuth flow"
echo "   - You should return to the blog post (no 404!)"
echo ""
echo "📚 For more details, see: docs/GISCUS_VERCEL_404_FIX.md"
echo ""
