# Node.js Express TypeScript MVC Application

A production-ready Node.js application built with TypeScript and Express, following a clean MVC architecture with strict separation of concerns.

## 🏗️ Architecture

This application follows a layered architecture with clear responsibilities:

- **Controller Layer**: Handles HTTP requests/responses, basic validation
- **Service Layer**: Contains all business logic
- **DAO Layer**: Database access only (CRUD operations)
- **DTO Layer**: TypeScript interfaces/types for data transfer
- **Model Layer**: Database schemas (Mongoose)
- **Route Layer**: API endpoint definitions
- **Config Layer**: Environment variables and database configuration
- **Middleware Layer**: Authentication, error handling, logging
- **Utils Layer**: Reusable utility functions

## 📁 Project Structure

```
src/
├── app.ts                # Express app initialization
├── server.ts             # Server bootstrap
├── config/               # Configuration files
│   ├── db.config.ts      # Database connection
│   └── env.config.ts     # Environment variables
├── routes/               # Route definitions
│   ├── index.ts          # Route aggregator
│   └── user.routes.ts    # User routes
├── controllers/          # Request handlers
│   └── user.controller.ts
├── services/             # Business logic
│   └── user.service.ts
├── dao/                  # Data access objects
│   └── user.dao.ts
├── models/               # Database schemas
│   └── user.model.ts
├── dto/                  # Data transfer objects
│   └── user.dto.ts
├── middleware/           # Express middleware
│   ├── auth.middleware.ts
│   └── error.middleware.ts
├── utils/                # Utility functions
│   ├── logger.ts
│   └── response.util.ts
├── constants/            # Application constants
│   └── httpStatus.ts
└── types/                # TypeScript type definitions
    └── express.d.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/app_2026
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=7d
   ```

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## 📡 API Endpoints

### User Endpoints

#### Create User
```http
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User by ID (Protected)
```http
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update User (Protected)
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

#### Delete User (Protected)
```http
DELETE /api/users/:id
Authorization: Bearer <token>
```

### Health Check
```http
GET /api/health
```

## 🔐 Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🛠️ Technologies Used

- **TypeScript**: Type-safe JavaScript
- **Express**: Web framework
- **MongoDB**: Database
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **express-validator**: Request validation

## 📝 Code Quality

- TypeScript strict mode enabled
- Clean code principles
- SOLID design patterns
- Comprehensive error handling
- Centralized logging
- Type-safe throughout

## 🧪 Development

### Build
```bash
npm run build
```

### Lint
```bash
npm run lint
```

## 📄 License

ISC

