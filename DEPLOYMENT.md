# Wedding Card Online Service - Fly.io Deployment Guide

## Prerequisites

1. Install Fly CLI:

   ```bash
   # macOS
   brew install flyctl

   # Or download from: https://fly.io/docs/hands-on/install-flyctl/
   ```

2. Login to Fly.io:
   ```bash
   flyctl auth login
   ```

## Deployment Steps

### 1. Create Fly.io App

```bash
# Initialize fly app (if not done already)
flyctl launch --no-deploy

# Or use existing configuration
flyctl apps create wedding-card-service --org personal
```

### 2. Set Environment Variables

```bash
# Database
flyctl secrets set MONGODB_URI="your_mongodb_connection_string"
flyctl secrets set MONGODB_DB_NAME="wedding_cards"

# JWT
flyctl secrets set JWT_SECRET="your_super_secure_jwt_secret"
flyctl secrets set JWT_USERNAME="your_username"

# Firebase (if using)
flyctl secrets set FIREBASE_PROJECT_ID="your_project_id"
flyctl secrets set FIREBASE_PRIVATE_KEY_ID="your_key_id"
flyctl secrets set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
your_private_key_here
-----END PRIVATE KEY-----"
flyctl secrets set FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxx@project.iam.gserviceaccount.com"
flyctl secrets set FIREBASE_CLIENT_ID="your_client_id"
flyctl secrets set FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"

# Application
flyctl secrets set TOKEN="your_generated_token"
```

### 3. Deploy Application

```bash
# Deploy to Fly.io
flyctl deploy

# Check deployment status
flyctl status

# View logs
flyctl logs
```

### 4. Configure Custom Domain (Optional)

```bash
# Add custom domain
flyctl certs create your-domain.com

# Add CNAME record in your DNS:
# CNAME your-domain.com -> wedding-card-service.fly.dev
```

## Useful Commands

```bash
# Check app status
flyctl status

# View logs
flyctl logs --app wedding-card-service

# Scale app
flyctl scale count 2

# SSH into app
flyctl ssh console

# Open app in browser
flyctl open

# Check secrets
flyctl secrets list

# Update secret
flyctl secrets set KEY="new_value"
```

## Environment Variables Required

- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DB_NAME` - Database name
- `JWT_SECRET` - JWT signing secret
- `JWT_USERNAME` - Default username
- `TOKEN` - Pre-generated token
- Firebase variables (if using Firebase Storage)

## URLs After Deployment

- App URL: `https://wedding-card-service.fly.dev`
- Health Check: `https://wedding-card-service.fly.dev/health`
- API Base: `https://wedding-card-service.fly.dev/api`

## Troubleshooting

### View App Logs

```bash
flyctl logs --app wedding-card-service
```

### Check Health Status

```bash
curl https://wedding-card-service.fly.dev/health
```

### Restart App

```bash
flyctl apps restart wedding-card-service
```

### Scale Resources

```bash
flyctl scale memory 512  # Increase memory to 512MB
flyctl scale count 2     # Scale to 2 instances
```
