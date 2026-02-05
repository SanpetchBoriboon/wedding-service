#!/bin/bash

# Fly.io Secrets Configuration Script
# Reads values from .env file

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "🚀 Setting up Fly.io secrets from .env file..."
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo "   Please create a .env file with your configuration."
    echo "   You can copy from .env.example and update the values."
    exit 1
fi

# Source the .env file
source .env

# Count successful and failed secrets
SUCCESS_COUNT=0
WARNING_COUNT=0

echo -e "${BLUE}📋 Configuration Status:${NC}"
echo -e "${GREEN}✅ NODE_ENV=production (already set)${NC}"
echo -e "${GREEN}✅ PORT=3000 (already set)${NC}"
echo -e "${GREEN}✅ MONGODB_DB_NAME=wedding_cards (already set)${NC}"
echo ""

echo -e "${BLUE}🔐 Setting Required Secrets:${NC}"

# Database - REQUIRED
if [ -n "$MONGODB_URI" ]; then
    echo -e "${GREEN}  ✅ MongoDB URI${NC}"
    flyctl secrets set MONGODB_URI="$MONGODB_URI"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
else
    echo -e "${RED}  ❌ MongoDB URI - missing in .env${NC}"
    WARNING_COUNT=$((WARNING_COUNT + 1))
fi

# JWT Configuration - REQUIRED
if [ -n "$JWT_SECRET" ]; then
    echo -e "${GREEN}  ✅ JWT Secret${NC}"
    flyctl secrets set JWT_SECRET="$JWT_SECRET"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
else
    echo -e "${RED}  ❌ JWT Secret - missing in .env${NC}"
    WARNING_COUNT=$((WARNING_COUNT + 1))
fi

if [ -n "$JWT_USERNAME" ]; then
    echo -e "${GREEN}  ✅ JWT Username${NC}"
    flyctl secrets set JWT_USERNAME="$JWT_USERNAME"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
else
    echo -e "${RED}  ❌ JWT Username - missing in .env${NC}"
    WARNING_COUNT=$((WARNING_COUNT + 1))
fi

# Allow Date
if [ -n "$ALLOWE_DATE" ]; then
    echo -e "${GREEN}  ✅ Allow Date${NC}"
    flyctl secrets set ALLOWE_DATE="$ALLOWE_DATE"
    SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
else
    echo -e "${YELLOW}  ⚠️  Allow Date - missing in .env (optional)${NC}"
fi

echo ""
echo -e "${BLUE}🔥 Firebase Configuration (Optional):${NC}"

# Firebase Configuration - OPTIONAL
if [ -n "$FIREBASE_PROJECT_ID" ]; then
    echo -e "${GREEN}  ✅ Firebase Project ID${NC}"
    flyctl secrets set FIREBASE_PROJECT_ID="$FIREBASE_PROJECT_ID"

    # Firebase secrets
    [ -n "$FIREBASE_PRIVATE_KEY_ID" ] && { echo -e "${GREEN}  ✅ Firebase Private Key ID${NC}"; flyctl secrets set FIREBASE_PRIVATE_KEY_ID="$FIREBASE_PRIVATE_KEY_ID"; }
    [ -n "$FIREBASE_PRIVATE_KEY" ] && { echo -e "${GREEN}  ✅ Firebase Private Key${NC}"; flyctl secrets set FIREBASE_PRIVATE_KEY="$FIREBASE_PRIVATE_KEY"; }
    [ -n "$FIREBASE_CLIENT_EMAIL" ] && { echo -e "${GREEN}  ✅ Firebase Client Email${NC}"; flyctl secrets set FIREBASE_CLIENT_EMAIL="$FIREBASE_CLIENT_EMAIL"; }
    [ -n "$FIREBASE_CLIENT_ID" ] && { echo -e "${GREEN}  ✅ Firebase Client ID${NC}"; flyctl secrets set FIREBASE_CLIENT_ID="$FIREBASE_CLIENT_ID"; }
    [ -n "$FIREBASE_STORAGE_BUCKET" ] && { echo -e "${GREEN}  ✅ Firebase Storage Bucket${NC}"; flyctl secrets set FIREBASE_STORAGE_BUCKET="$FIREBASE_STORAGE_BUCKET"; }

    # Default URLs
    if [ -n "$FIREBASE_AUTH_URI" ]; then
        echo -e "${GREEN}  ✅ Firebase Auth URI (from .env)${NC}"
        flyctl secrets set FIREBASE_AUTH_URI="$FIREBASE_AUTH_URI"
    else
        echo -e "${YELLOW}  ⚡ Firebase Auth URI (default)${NC}"
        flyctl secrets set FIREBASE_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
    fi

    if [ -n "$FIREBASE_TOKEN_URI" ]; then
        echo -e "${GREEN}  ✅ Firebase Token URI (from .env)${NC}"
        flyctl secrets set FIREBASE_TOKEN_URI="$FIREBASE_TOKEN_URI"
    else
        echo -e "${YELLOW}  ⚡ Firebase Token URI (default)${NC}"
        flyctl secrets set FIREBASE_TOKEN_URI="https://oauth2.googleapis.com/token"
    fi

    # Certificate URLs
    if [ -n "$FIREBASE_CLIENT_CERT_URL" ]; then
        echo -e "${GREEN}  ✅ Firebase Client Cert URL${NC}"
        flyctl secrets set FIREBASE_CLIENT_CERT_URL="$FIREBASE_CLIENT_CERT_URL"
    fi

    if [ -n "$FIREBASE_CLIENT_X509_CERT_URL" ]; then
        echo -e "${GREEN}  ✅ Firebase Client X509 Cert URL${NC}"
        flyctl secrets set FIREBASE_CLIENT_X509_CERT_URL="$FIREBASE_CLIENT_X509_CERT_URL"
    fi

    echo -e "${GREEN}  ✅ Firebase URLs configured${NC}"
else
    echo -e "${YELLOW}  ℹ️  Firebase not configured (optional)${NC}"
fi

echo ""
echo "==========================================="
echo -e "${GREEN}🎉 Secrets Configuration Complete!${NC}"
echo "==========================================="
echo ""

# Show summary
if [ $WARNING_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ All required secrets configured successfully${NC}"
else
    echo -e "${YELLOW}⚠️  $WARNING_COUNT warning(s) found - check missing values above${NC}"
fi

echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "   ${GREEN}1.${NC} Verify secrets: ${YELLOW}flyctl secrets list${NC}"
echo -e "   ${GREEN}2.${NC} Deploy app:     ${YELLOW}flyctl deploy${NC}"
echo -e "   ${GREEN}3.${NC} Check status:   ${YELLOW}flyctl status${NC}"
echo -e "   ${GREEN}4.${NC} View logs:      ${YELLOW}flyctl logs${NC}"
echo ""
