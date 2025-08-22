# Authentication API

A role-based authentication API built with Node.js, Express, TypeScript, and MongoDB.

## Features

- User and Admin roles
- Separate registration endpoints for each role
- Common login endpoint
- JWT-based authentication
- Role-based access control
- Protected routes
- Organized route structure
- User profile management
- Password updates
- User blocking/unblocking (admin only)

## Technologies Used

- Node.js
- TypeScript
- Express
- MongoDB with Mongoose
- JWT for authentication
- Joi for request validation
- Bcrypt for password hashing
- Swagger/OpenAPI for API documentation

## Project Structure

The project follows a flat structure with DTO and DAO design patterns:

```
src/
  ├── config.ts              # Application configuration
  ├── server.ts              # Express server setup
  ├── swagger.ts             # Swagger configuration
  ├── models/                # MongoDB models
  ├── dtos/                  # Data Transfer Objects
  ├── daos/                  # Data Access Objects
  ├── controllers/           # Request handlers
  ├── routes/                # API routes
  │   ├── routes.ts          # Main routes organizer
  │   ├── auth.routes.ts     # Authentication routes
  │   ├── user.routes.ts     # User-specific routes
  │   ├── admin.routes.ts    # Admin-specific routes
  ├── middleware/            # Express middleware
  ├── joi-validation/        # Joi validation schemas
  ├── swagger-docs/          # Swagger documentation
      ├── auth.swagger.ts    # Auth endpoints documentation
      ├── user.swagger.ts    # User endpoints documentation
      ├── admin.swagger.ts   # Admin endpoints documentation
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

## API Documentation

The API is documented using Swagger (OpenAPI) and is available at:

```
http://localhost:3000/api-docs
```

The Swagger UI provides an interactive documentation where you can:
- Explore all available endpoints
- See request/response schemas
- Test API endpoints directly from the browser
- View authentication requirements for each endpoint

## API Endpoints

### Authentication

- **POST /api/auth/register/user** - Register a new regular user
  - Body: `{ "name": "User Name", "email": "user@example.com", "password": "password" }`

- **POST /api/auth/register/admin** - Register a new admin user
  - Body: `{ "name": "Admin Name", "email": "admin@example.com", "password": "password" }`

- **POST /api/auth/login** - Login (works for both user types)
  - Body: `{ "email": "user@example.com", "password": "password" }`

- **GET /api/auth/profile** - Get user profile (requires authentication)
  - Headers: `Authorization: Bearer <token>`

### User Routes

- **GET /api/users/profile** - Get user profile
  - Headers: `Authorization: Bearer <token>`

- **PUT /api/users/profile** - Update user profile
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "name": "Updated Name" }`

- **PUT /api/users/password** - Update user password
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "currentPassword": "oldPassword", "newPassword": "newPassword" }`

- **GET /api/users/dashboard** - User dashboard (regular users only)
  - Headers: `Authorization: Bearer <token>` (token must belong to a regular user)

- **GET /api/users/profile/settings** - User settings (regular users only)
  - Headers: `Authorization: Bearer <token>` (token must belong to a regular user)

### Admin Routes

- **GET /api/admin/dashboard** - Admin dashboard (admin users only)
  - Headers: `Authorization: Bearer <token>` (token must belong to an admin user)

- **GET /api/admin/users** - Get all users (admin users only)
  - Headers: `Authorization: Bearer <token>` (token must belong to an admin user)

- **GET /api/admin/users/:id** - Get specific user by ID (admin users only)
  - Headers: `Authorization: Bearer <token>` (token must belong to an admin user)

- **PUT /api/admin/users/:id/status** - Block or unblock a user (admin users only)
  - Headers: `Authorization: Bearer <token>` (token must belong to an admin user)
  - Body: `{ "isActive": false }` (to block) or `{ "isActive": true }` (to unblock)

- **GET /api/admin/settings** - System settings (admin users only)
  - Headers: `Authorization: Bearer <token>` (token must belong to an admin user)

### Role-Based Access Control

The API implements role-based access control with two roles:

1. **User** - Regular user with limited access
2. **Admin** - Administrator with elevated privileges

JWT tokens include role information, and middleware functions verify appropriate access levels for protected routes.

## License

ISC