#!/bin/bash

# Pre-Deployment Check Script
# Run this before deploying to Vercel

echo "🚀 Pre-Deployment Check Starting..."
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Track overall status
ERRORS=0
WARNINGS=0

# 1. Check Node version
echo "📦 Checking Node.js version..."
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 22 ]; then
    echo -e "${GREEN}✓${NC} Node.js version: $(node -v)"
else
    echo -e "${RED}✗${NC} Node.js version too old. Required: >=22.0.0"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 2. Install dependencies
echo "📥 Installing dependencies..."
if npm install --silent; then
    echo -e "${GREEN}✓${NC} Dependencies installed"
else
    echo -e "${RED}✗${NC} Failed to install dependencies"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 3. Check TypeScript compilation
echo "🔍 Checking TypeScript compilation..."
if npx tsc --noEmit; then
    echo -e "${GREEN}✓${NC} TypeScript compilation successful"
else
    echo -e "${RED}✗${NC} TypeScript compilation failed"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 4. Run linter (warnings only)
echo "🔎 Running ESLint..."
if npm run lint; then
    echo -e "${GREEN}✓${NC} No linting errors"
else
    echo -e "${YELLOW}⚠${NC} Linting warnings found (non-blocking)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 5. Build for production
echo "🏗️  Building for production..."
if npm run build; then
    echo -e "${GREEN}✓${NC} Production build successful"
else
    echo -e "${RED}✗${NC} Production build failed"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 6. Check for security vulnerabilities
echo "🔒 Checking security vulnerabilities..."
if npm audit --audit-level=high; then
    echo -e "${GREEN}✓${NC} No high/critical vulnerabilities"
else
    echo -e "${YELLOW}⚠${NC} Security vulnerabilities found (check npm audit)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# 7. Check environment variables
echo "🔐 Checking environment variables..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local file exists"
    
    # Check critical variables
    MISSING_VARS=0
    while IFS= read -r line; do
        if [[ $line =~ ^VITE_.*=$ ]]; then
            VAR_NAME=$(echo "$line" | cut -d'=' -f1)
            echo -e "${YELLOW}⚠${NC} Empty variable: $VAR_NAME"
            MISSING_VARS=$((MISSING_VARS + 1))
        fi
    done < .env.local
    
    if [ $MISSING_VARS -gt 0 ]; then
        echo -e "${YELLOW}⚠${NC} $MISSING_VARS empty environment variables"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}✗${NC} .env.local file not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 8. Check critical files
echo "📁 Checking critical files..."
CRITICAL_FILES=(
    "public/icon.png"
    "public/data/info.json"
    "public/data/projects.json"
    "public/data/social.json"
    "vercel.json"
    "index.html"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} Missing: $file"
        ERRORS=$((ERRORS + 1))
    fi
done
echo ""

# 9. Check bundle size
echo "📊 Checking bundle size..."
BUNDLE_SIZE=$(du -sh dist/assets/*.js 2>/dev/null | awk '{print $1}' | head -1)
if [ -n "$BUNDLE_SIZE" ]; then
    echo -e "${GREEN}✓${NC} Main bundle size: $BUNDLE_SIZE"
    
    # Warn if bundle is too large (>1MB)
    SIZE_KB=$(du -k dist/assets/*.js 2>/dev/null | awk '{print $1}' | head -1)
    if [ "$SIZE_KB" -gt 1024 ]; then
        echo -e "${YELLOW}⚠${NC} Bundle size is large. Consider code-splitting."
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠${NC} Could not determine bundle size"
fi
echo ""

# Summary
echo "=================================="
echo "📋 Summary"
echo "=================================="
echo -e "Errors: ${RED}$ERRORS${NC}"
echo -e "Warnings: ${YELLOW}$WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ READY FOR DEPLOYMENT${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Verify environment variables in Vercel dashboard"
    echo "2. Run: vercel --prod"
    echo "3. Test the deployed site"
    exit 0
else
    echo -e "${RED}❌ NOT READY FOR DEPLOYMENT${NC}"
    echo ""
    echo "Please fix the errors above before deploying."
    exit 1
fi
