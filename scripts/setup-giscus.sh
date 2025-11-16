#!/bin/bash

# Giscus Setup Helper Script
# This script helps you configure Giscus step-by-step

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Giscus Configuration Setup Helper   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check GitHub Discussions
echo -e "${YELLOW}Step 1: Enable GitHub Discussions${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Open this URL in your browser:"
echo -e "${GREEN}https://github.com/TheCreateGM/portfolio-page-v2/settings${NC}"
echo ""
echo "2. Scroll to 'Features' section"
echo "3. Check ✅ 'Discussions'"
echo "4. Click 'Set up discussions'"
echo ""
read -p "Press Enter when you've enabled Discussions..."
echo ""

# Step 2: Install Giscus App
echo -e "${YELLOW}Step 2: Install Giscus App${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Open this URL in your browser:"
echo -e "${GREEN}https://github.com/apps/giscus${NC}"
echo ""
echo "2. Click 'Install' or 'Configure'"
echo "3. Select repository: TheCreateGM/portfolio-page-v2"
echo "4. Grant necessary permissions"
echo ""
read -p "Press Enter when you've installed the Giscus app..."
echo ""

# Step 3: Get Configuration
echo -e "${YELLOW}Step 3: Get Your Giscus Configuration${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Open this URL in your browser:"
echo -e "${GREEN}https://giscus.app${NC}"
echo ""
echo "2. Fill in the configuration form:"
echo "   - Repository: TheCreateGM/portfolio-page-v2"
echo "   - Page ↔️ Discussions Mapping: pathname"
echo "   - Discussion Category: Announcements (or create 'Comments')"
echo "   - Features: Enable reactions, metadata, etc."
echo ""
echo "3. Scroll down to see the generated script tag"
echo ""
echo "4. Copy the following values from the script:"
echo "   - data-repo-id (looks like: R_kgDOPeMVXQ)"
echo "   - data-category-id (looks like: DIC_kwDOPeMVXc4Cx2cW)"
echo ""
read -p "Press Enter when you're ready to input your configuration..."
echo ""

# Get user input
echo -e "${BLUE}Enter your Giscus configuration:${NC}"
echo ""

read -p "Repository (default: TheCreateGM/portfolio-page-v2): " repo
repo=${repo:-TheCreateGM/portfolio-page-v2}

read -p "Repo ID (from giscus.app): " repo_id
while [ -z "$repo_id" ]; do
    echo -e "${RED}Repo ID is required!${NC}"
    read -p "Repo ID (from giscus.app): " repo_id
done

read -p "Category (default: Announcements): " category
category=${category:-Announcements}

read -p "Category ID (from giscus.app): " category_id
while [ -z "$category_id" ]; do
    echo -e "${RED}Category ID is required!${NC}"
    read -p "Category ID (from giscus.app): " category_id
done

echo ""

# Step 4: Update .env.local
echo -e "${YELLOW}Step 4: Updating .env.local${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}Creating .env.local from .env.example...${NC}"
    cp .env.example .env.local
fi

# Backup existing .env.local
cp .env.local .env.local.backup
echo -e "${GREEN}✅ Backed up .env.local to .env.local.backup${NC}"

# Update Giscus variables
sed -i "s|^VITE_GISCUS_REPO=.*|VITE_GISCUS_REPO=$repo|" .env.local
sed -i "s|^VITE_GISCUS_REPO_ID=.*|VITE_GISCUS_REPO_ID=$repo_id|" .env.local
sed -i "s|^VITE_GISCUS_CATEGORY=.*|VITE_GISCUS_CATEGORY=$category|" .env.local
sed -i "s|^VITE_GISCUS_CATEGORY_ID=.*|VITE_GISCUS_CATEGORY_ID=$category_id|" .env.local

echo -e "${GREEN}✅ Updated .env.local with your Giscus configuration${NC}"
echo ""

# Step 5: Verify Configuration
echo -e "${YELLOW}Step 5: Verifying Configuration${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -f "scripts/check-giscus.sh" ]; then
    bash scripts/check-giscus.sh
else
    echo -e "${YELLOW}⚠️  check-giscus.sh not found, skipping verification${NC}"
fi

echo ""

# Step 6: Vercel Instructions
echo -e "${YELLOW}Step 6: Update Vercel Environment Variables${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Now you need to add these variables to Vercel:"
echo ""
echo -e "${GREEN}VITE_GISCUS_REPO=$repo${NC}"
echo -e "${GREEN}VITE_GISCUS_REPO_ID=$repo_id${NC}"
echo -e "${GREEN}VITE_GISCUS_CATEGORY=$category${NC}"
echo -e "${GREEN}VITE_GISCUS_CATEGORY_ID=$category_id${NC}"
echo -e "${GREEN}VITE_GISCUS_MAPPING=pathname${NC}"
echo -e "${GREEN}VITE_GISCUS_STRICT=1${NC}"
echo -e "${GREEN}VITE_GISCUS_REACTIONS_ENABLED=1${NC}"
echo -e "${GREEN}VITE_GISCUS_EMIT_METADATA=1${NC}"
echo -e "${GREEN}VITE_GISCUS_INPUT_POSITION=top${NC}"
echo -e "${GREEN}VITE_GISCUS_LANG=en${NC}"
echo -e "${GREEN}VITE_GISCUS_THEME=preferred_color_scheme${NC}"
echo -e "${GREEN}VITE_GISCUS_LOADING=lazy${NC}"
echo ""
echo "1. Go to your Vercel dashboard:"
echo -e "${BLUE}https://vercel.com/your-username/portfolio-page-v2/settings/environment-variables${NC}"
echo ""
echo "2. Add each variable above"
echo "3. Set for ALL environments: Production, Preview, Development"
echo "4. Click 'Save' for each variable"
echo ""
read -p "Press Enter when you've updated Vercel environment variables..."
echo ""

# Step 7: Deploy
echo -e "${YELLOW}Step 7: Deploy Your Changes${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Choose deployment method:"
echo ""
echo "Option A: Push to Git (recommended)"
echo -e "${BLUE}git add .env.local${NC}"
echo -e "${BLUE}git commit -m \"fix: Update Giscus configuration\"${NC}"
echo -e "${BLUE}git push${NC}"
echo ""
echo "Option B: Manual redeploy in Vercel"
echo "1. Go to your Vercel dashboard"
echo "2. Click 'Deployments'"
echo "3. Click '...' on latest deployment"
echo "4. Click 'Redeploy'"
echo ""

# Summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║     Setup Complete! 🎉                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo "Next steps:"
echo "1. Deploy your changes (see Option A or B above)"
echo "2. Wait for deployment to complete"
echo "3. Visit your blog post to test comments"
echo ""
echo "Test URL:"
echo -e "${BLUE}https://axogm.vercel.app/blog/welcome-to-my-portfolio${NC}"
echo ""
echo "If you encounter issues, check:"
echo "- docs/FIX_GUIDE.md"
echo "- docs/TROUBLESHOOTING.md"
echo ""
