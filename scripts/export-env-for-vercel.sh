#!/bin/bash

# Export Environment Variables for Vercel
# This script generates commands to add env vars to Vercel

echo "📋 Copy and paste these commands in your terminal:"
echo ""
echo "# Make sure you have Vercel CLI installed:"
echo "# npm i -g vercel"
echo ""
echo "# Login to Vercel:"
echo "vercel login"
echo ""
echo "# Link your project (run this in your project directory):"
echo "vercel link"
echo ""
echo "# Add environment variables:"
echo ""

# Read .env.local and generate vercel env add commands
if [ -f ".env.local" ]; then
  while IFS='=' read -r key value; do
    # Skip comments and empty lines
    if [[ ! "$key" =~ ^#.*$ ]] && [[ -n "$key" ]]; then
      # Remove leading/trailing whitespace
      key=$(echo "$key" | xargs)
      value=$(echo "$value" | xargs)
      
      # Only process VITE_ variables and other important ones
      if [[ "$key" =~ ^VITE_ ]] || [[ "$key" =~ ^(PORTFOLIO_|ENCRYPTION_|RATE_LIMIT_|NODE_ENV|BUILD_TIMESTAMP|VERCEL_|ENABLE_) ]]; then
        echo "echo '$value' | vercel env add $key production"
      fi
    fi
  done < .env.local
  
  echo ""
  echo "# After adding all variables, redeploy:"
  echo "vercel --prod"
  echo ""
  echo "✅ Done! Your site will be redeployed with the new environment variables."
else
  echo "❌ Error: .env.local file not found!"
  echo "Make sure you're running this script from the project root directory."
  exit 1
fi
