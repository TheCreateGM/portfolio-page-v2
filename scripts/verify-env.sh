#!/bin/bash

# Verify Environment Variables Script
# Checks if all required environment variables are set

echo "🔍 Verifying Environment Variables..."
echo ""

MISSING=0

# Required Giscus variables
GISCUS_VARS=(
  "VITE_GISCUS_REPO"
  "VITE_GISCUS_REPO_ID"
  "VITE_GISCUS_CATEGORY"
  "VITE_GISCUS_CATEGORY_ID"
)

# Required Supabase variables
SUPABASE_VARS=(
  "VITE_SUPABASE_URL"
  "VITE_SUPABASE_ANON_KEY"
)

echo "📝 Checking Giscus Configuration:"
for var in "${GISCUS_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "  ❌ $var is NOT set"
    MISSING=$((MISSING + 1))
  else
    echo "  ✅ $var is set"
  fi
done

echo ""
echo "📝 Checking Supabase Configuration:"
for var in "${SUPABASE_VARS[@]}"; do
  if [ -z "${!var}" ]; then
    echo "  ❌ $var is NOT set"
    MISSING=$((MISSING + 1))
  else
    echo "  ✅ $var is set"
  fi
done

echo ""
if [ $MISSING -eq 0 ]; then
  echo "✅ All required environment variables are set!"
  exit 0
else
  echo "❌ $MISSING environment variable(s) missing!"
  echo ""
  echo "💡 To fix on Vercel:"
  echo "   1. Go to https://vercel.com/dashboard"
  echo "   2. Select your project"
  echo "   3. Settings → Environment Variables"
  echo "   4. Add the missing variables"
  echo "   5. Redeploy your site"
  exit 1
fi
