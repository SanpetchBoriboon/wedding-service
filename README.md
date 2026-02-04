# Wedding Card Online Service

A modern Express.js web service for creating and managing digital wedding invitation cards.

## Features

- RESTful API for wedding card management
- Express.js server with security middleware
- Static file serving for frontend assets
- Environment-based configuration
- Health check endpoint
- Error handling and logging

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   Or for production:
   ```bash
   npm start
   ```

5. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

### Base URL: `http://localhost:3000`

### Available Endpoints

- **GET /** - Welcome message and API status
- **GET /api/cards** - Get list of wedding card templates
- **POST /api/cards** - Create a new wedding card
- **GET /health** - Health check endpoint

### Example Usage

#### Create a Wedding Card
```bash
curl -X POST http://localhost:3000/api/cards \
  -H "Content-Type: application/json" \
  -d '{
    "title": "John & Jane Wedding",
    "message": "You are cordially invited to celebrate our special day",
    "template": "elegant"
  }'
```

#### Get Cards List
```bash
curl http://localhost:3000/api/cards
```

## Project Structure

```
wedding-card-online-service/
├── .github/
│   └── copilot-instructions.md
├── public/
│   └── index.html
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Technologies Used

- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Dotenv** - Environment variables management
- **Nodemon** - Development auto-restart

## Development

- **Development mode**: `npm run dev` (uses nodemon for auto-restart)
- **Production mode**: `npm start`
- **Environment**: Configure via `.env` file

## Environment Variables

See `.env.example` for available configuration options:

- `NODE_ENV` - Application environment (development/production)
- `PORT` - Server port (default: 3000)

## Security Features

- Helmet.js for security headers
- CORS enabled for cross-origin requests
- Input validation for API endpoints
- Error handling middleware

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