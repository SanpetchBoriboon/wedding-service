# Wedding Card Online Service - Copilot Instructions

This project is a JavaScript Express.js web service for creating and managing digital wedding invitation cards.

## Project Structure
- Express.js server with RESTful API
- Static file serving for frontend assets
- Environment-based configuration
- Security middleware (Helmet, CORS)
- Development and production scripts

## Key Features
- Wedding card creation and management API
- Health check endpoint
- Error handling and logging
- Environment variable configuration
- Development server with auto-restart

## Development Commands
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm install` - Install dependencies

## API Endpoints
- `GET /` - Welcome message
- `GET /api/cards` - List wedding cards
- `POST /api/cards` - Create new wedding card
- `GET /health` - Health check

The server runs on port 3000 by default and can be configured via environment variables.