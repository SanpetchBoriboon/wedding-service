# Wedding Card Online Service

A modern Express.js web service for creating and managing digital wedding invitation cards with image upload, Firebase Storage integration, and JWT authentication.

## 🚀 Live Demo

- **Production URL**: https://wedding-card-online-service.fly.dev
- **Health Check**: https://wedding-card-online-service.fly.dev/health

## ✨ Features

- RESTful API for wedding card management
- JWT-based authentication system
- Image upload with Firebase Storage integration
- CORS-friendly image proxy for Firebase Storage
- MongoDB with Mongoose ODM
- Auto-deployment with GitHub Actions
- Express.js server with security middleware
- Health monitoring and status endpoints
- Token-based access control (limited by date)

## 🛠 Tech Stack

- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose
- **Storage**: Firebase Storage
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Deployment**: Fly.io
- **CI/CD**: GitHub Actions

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm package manager
- MongoDB database
- Firebase project (optional, for image storage)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd wedding-card-online-service
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Generate JWT token:

   ```bash
   npm run generate-token
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. For production:
   ```bash
   npm start
   ```

## 🔧 Environment Variables

Create a `.env` file with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string
MONGODB_DB_NAME=wedding_cards

# JWT Configuration
JWT_SECRET=your_super_secure_secret
JWT_USERNAME=your_username

# Firebase (Optional)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=project.firebasestorage.app

# Application
NODE_ENV=development
PORT=3000
TOKEN=generated_jwt_token
```

## 📚 API Endpoints

### Base URL

- **Local**: `http://localhost:3000`
- **Production**: `https://wedding-card-online-service.fly.dev`

### Authentication Endpoints

#### Get Guest Token (Available only on 2026-02-26)

```bash
POST /api/auth/:role/tokens
Content-Type: application/json
```

#### Verify Token

```bash
POST /api/auth/verify
Authorization: Bearer your_jwt_token
```

### Card Management

#### List Cards

```bash
GET /api/cards
Authorization: Bearer your_jwt_token (optional)
```

#### Delete Card (Admin only)

```bash
DELETE /api/cards/:id
Authorization: Bearer your_jwt_token
```

### File Upload

#### Upload Card with Image

```bash
POST /api/upload/card-image
Authorization: Bearer your_jwt_token
Content-Type: multipart/form-data

Form Data:
- title: "Wedding Card Title"
- message: "Your wedding message"
- image: [file]
```

### Utilities

#### Health Check

```bash
GET /health
```

#### Image Proxy (CORS-friendly)

```bash
GET /api/cards/image-proxy?url=firebase_storage_url
```

## 💾 Data Models

### Card Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  message: String (required),
  template: String (default: "default"),
  imageUrl: String,
  createdBy: String (required),
  userId: Number (required),
  status: String (enum: ["active", "inactive", "deleted"]),
  createdAt: Date,
  updatedAt: Date
}
```

## 📁 Project Structure

```
wedding-card-online-service/
├── .github/
│   ├── workflows/
│   │   └── fly-deploy.yml          # GitHub Actions deployment
│   └── copilot-instructions.md
├── public/
│   └── index.html
├── scripts/
│   └── generate-token.js           # JWT token generator
├── src/
│   ├── config/
│   │   ├── mongoose.js             # MongoDB connection
│   │   └── firebase.js             # Firebase configuration
│   ├── middleware/
│   │   └── auth.js                 # JWT authentication
│   ├── models/
│   │   └── cardModel.js            # Mongoose card schema
│   └── routes/
│       ├── index.js                # Route aggregator
│       ├── auth/
│       │   └── auth.js             # Authentication routes
│       ├── cards/
│       │   └── cards.js            # Card management routes
│       └── upload/
│           └── upload.js           # File upload routes
├── .dockerignore
├── .env.example
├── .gitignore
├── DEPLOYMENT.md                   # Deployment guide
├── Dockerfile                      # Docker configuration
├── fly.toml                        # Fly.io configuration
├── package.json
├── README.md
├── server.js                       # Main application file
└── setup-fly-secrets.sh           # Fly.io secrets setup
```

## 🔧 Technologies Used

### Backend

- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload middleware
- **Axios** - HTTP client for image proxy

### Security & Middleware

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

### Storage & Database

- **MongoDB** - Document database
- **Firebase Storage** - File storage service

### Deployment & CI/CD

- **Fly.io** - Application hosting
- **GitHub Actions** - Continuous deployment
- **Docker** - Containerization

## 🚀 Deployment

### Fly.io Deployment

This project is configured for automatic deployment to Fly.io using GitHub Actions.

#### Manual Deployment

```bash
# Install Fly CLI
brew install flyctl

# Login to Fly.io
flyctl auth login

# Deploy application
flyctl deploy --remote-only
```

#### Auto Deployment

- Push to `main` branch triggers automatic deployment
- GitHub Actions workflow handles the deployment process
- Health checks ensure successful deployment

#### Environment Setup

```bash
# Setup Fly.io secrets from .env file
./setup-fly-secrets.sh

# Or manually set secrets
flyctl secrets set MONGODB_URI="your_connection_string"
flyctl secrets set JWT_SECRET="your_secret"
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## 🔐 Authentication

### Token-Based Access Control

- **Guest tokens**: Available only on February 26, 2026
- **JWT expiration**: 24 hours
- **Rate limiting**: Based on date restrictions
- **Admin functions**: Require special role permissions

### Usage Example

```javascript
// Request guest token (only on 2026-02-26)
const response = await fetch("/api/auth/tokens/guest", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "wedding_guest" }),
});

const { token } = await response.json();

// Use token for API calls
fetch("/api/cards", {
  headers: { Authorization: `Bearer ${token}` },
});
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

ISC License - see package.json for details

## Support

For support or questions, please refer to the project documentation or create an issue in the repository.
