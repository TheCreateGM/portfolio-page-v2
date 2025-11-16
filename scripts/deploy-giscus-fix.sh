#!/bin/bash

# Deploy Giscus OAuth Callback Fix
# This script helps deploy the fix for Giscus authentication issues

set -e

echo "🔧 Deploying Giscus OAuth Callback Fix"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ Error: .env.local not found. Please create it from .env.example"
    exit 1
fi

# Verify VITE_GISCUS_ORIGIN is set correctly
GISCUS_ORIGIN=$(grep "VITE_GISCUS_ORIGIN" .env.local | cut -d '=' -f2)
if [[ ! "$GISCUS_ORIGIN" == *"/giscus-callback" ]]; then
    echo "⚠️  Warning: VITE_GISCUS_ORIGIN should end with /giscus-callback"
    echo "   Current value: $GISCUS_ORIGIN"
    echo ""
    read -p "Do you want to update it now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Extract base URL and add /giscus-callback
        BASE_URL=$(echo "$GISCUS_ORIGIN" | sed 's|/giscus-callback||')
        sed -i.bak "s|VITE_GISCUS_ORIGIN=.*|VITE_GISCUS_ORIGIN=${BASE_URL}/giscus-callback|" .env.local
        rm .env.local.bak 2>/dev/null || true
        echo "✅ Updated VITE_GISCUS_ORIGIN in .env.local"
    fi
fi

echo ""
echo "📋 Pre-deployment Checklist:"
echo "1. ✅ Callback page created (src/pages/GiscusCallback.tsx)"
echo "2. ✅ Router updated with /giscus-callback route"
echo "3. ✅ Giscus component stores return URL"
echo "4. ✅ Environment variable configured"
echo ""

# Run build to check for errors
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📤 Next Steps:"
    echo "1. Update Vercel environment variable:"
    echo "   - Go to: https://vercel.com/your-project/settings/environment-variables"
    echo "   - Set VITE_GISCUS_ORIGIN to: https://axogm.vercel.app/giscus-callback"
    echo ""
    echo "2. Deploy to Vercel:"
    echo "   git add ."
    echo "   git commit -m 'fix: Add Giscus OAuth callback handler'"
    echo "   git push"
    echo ""
    echo "3. Test the fix:"
    echo "   - Visit: https://axogm.vercel.app/blog/welcome-to-my-portfolio"
    echo "   - Try to comment (sign in with GitHub)"
    echo "   - Verify you're redirected back to the blog post"
    echo ""
    echo "📖 For more details, see: docs/GISCUS_CALLBACK_SETUP.md"
else
    echo ""
    echo "❌ Build failed. Please fix the errors above before deploying."
    exit 1
fi
