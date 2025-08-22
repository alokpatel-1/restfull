# Authentication API

A simple authentication API built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User registration
- User login
- JWT-based authentication
- Protected routes

## Technologies Used

- Node.js
- TypeScript
- Express
- MongoDB with Mongoose
- JWT for authentication
- Joi for request validation
- Bcrypt for password hashing

## Project Structure

The project follows a flat structure with DTO and DAO design patterns:

```
src/
  ├── config.ts              # Application configuration
  ├── server.ts              # Express server setup
  ├── models/                # MongoDB models
  ├── dtos/                  # Data Transfer Objects
  ├── daos/                  # Data Access Objects
  ├── controllers/           # Request handlers
  ├── routes/                # API routes
  ├── middleware/            # Express middleware
  ├── validation/            # Joi validation schemas
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory (use sample.env as a template):
   ```
   cp sample.env .env
   ```

4. Update the `.env` file with your configuration.

## Running the Application

### Development mode

```
npm run dev
```

### Production mode

```
npm run build
npm start
```

## API Endpoints

### Authentication

- **POST /api/auth/register** - Register a new user
  - Body: `{ "name": "User Name", "email": "user@example.com", "password": "password" }`

- **POST /api/auth/login** - Login
  - Body: `{ "email": "user@example.com", "password": "password" }`

- **GET /api/auth/profile** - Get user profile (requires authentication)
  - Headers: `Authorization: Bearer <token>`

## License

ISC