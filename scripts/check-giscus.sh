#!/bin/bash

# Giscus Configuration Checker
# This script validates your Giscus setup and helps diagnose issues

set -e

echo "🔍 Giscus Configuration Checker"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local not found${NC}"
    echo "Please create .env.local from .env.example"
    exit 1
fi

echo "✅ .env.local found"
echo ""

# Load environment variables
source .env.local

# Check required variables
echo "📋 Checking Giscus environment variables..."
echo ""

check_var() {
    var_name=$1
    var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        echo -e "${RED}❌ $var_name is not set${NC}"
        return 1
    elif [[ "$var_value" == *"your-"* ]] || [[ "$var_value" == *"yourdomain"* ]]; then
        echo -e "${YELLOW}⚠️  $var_name contains placeholder value${NC}"
        return 1
    else
        echo -e "${GREEN}✅ $var_name is set${NC}"
        return 0
    fi
}

errors=0

check_var "VITE_GISCUS_REPO" || ((errors++))
check_var "VITE_GISCUS_REPO_ID" || ((errors++))
check_var "VITE_GISCUS_CATEGORY" || ((errors++))
check_var "VITE_GISCUS_CATEGORY_ID" || ((errors++))

echo ""

if [ $errors -gt 0 ]; then
    echo -e "${RED}❌ Found $errors configuration issue(s)${NC}"
    echo ""
    echo "🔧 How to fix:"
    echo "1. Visit https://giscus.app"
    echo "2. Enter your repository: $VITE_GISCUS_REPO"
    echo "3. Select a category (e.g., 'Announcements')"
    echo "4. Copy the generated configuration"
    echo "5. Update your .env.local file"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ All Giscus variables are configured${NC}"
echo ""

# Check GitHub repository
echo "🔍 Checking GitHub repository..."
echo ""

REPO=$VITE_GISCUS_REPO
API_URL="https://api.github.com/repos/$REPO"

response=$(curl -s -w "\n%{http_code}" "$API_URL")
http_code=$(echo "$response" | tail -n1)
body=$(echo "$response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Repository is accessible${NC}"
    
    # Check if discussions are enabled
    has_discussions=$(echo "$body" | grep -o '"has_discussions":[^,]*' | cut -d':' -f2)
    
    if [ "$has_discussions" = "true" ]; then
        echo -e "${GREEN}✅ GitHub Discussions are enabled${NC}"
    else
        echo -e "${RED}❌ GitHub Discussions are NOT enabled${NC}"
        echo ""
        echo "🔧 Enable Discussions:"
        echo "1. Go to https://github.com/$REPO/settings"
        echo "2. Scroll to 'Features'"
        echo "3. Check 'Discussions'"
        exit 1
    fi
else
    echo -e "${RED}❌ Cannot access repository (HTTP $http_code)${NC}"
    echo "Repository: $REPO"
    exit 1
fi

echo ""

# Check Giscus app installation
echo "🔍 Checking Giscus app installation..."
echo ""
echo "⚠️  Cannot automatically verify Giscus app installation"
echo ""
echo "Please manually verify:"
echo "1. Visit: https://github.com/apps/giscus"
echo "2. Check if installed for: $REPO"
echo "3. Grant necessary permissions"
echo ""

# Validate repo ID format
echo "🔍 Validating configuration format..."
echo ""

if [[ ! "$VITE_GISCUS_REPO_ID" =~ ^[A-Za-z0-9_-]+$ ]]; then
    echo -e "${YELLOW}⚠️  VITE_GISCUS_REPO_ID format looks unusual${NC}"
    echo "Expected format: Base64-like string (e.g., R_kgDOHxYzAw)"
fi

if [[ ! "$VITE_GISCUS_CATEGORY_ID" =~ ^[A-Za-z0-9_-]+$ ]]; then
    echo -e "${YELLOW}⚠️  VITE_GISCUS_CATEGORY_ID format looks unusual${NC}"
    echo "Expected format: Base64-like string (e.g., DIC_kwDOHxYzA84CRxyz)"
fi

echo ""
echo "================================"
echo -e "${GREEN}✅ Giscus configuration check complete!${NC}"
echo ""
echo "📝 Current Configuration:"
echo "  Repository: $VITE_GISCUS_REPO"
echo "  Repo ID: ${VITE_GISCUS_REPO_ID:0:10}..."
echo "  Category: $VITE_GISCUS_CATEGORY"
echo "  Category ID: ${VITE_GISCUS_CATEGORY_ID:0:10}..."
echo ""
echo "🚀 Next steps:"
echo "1. Make sure these values are also set in Vercel environment variables"
echo "2. Redeploy your application"
echo "3. Test comments on your blog posts"
