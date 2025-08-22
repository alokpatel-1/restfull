/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         password:
 *           type: string
 *           format: password
 *           description: User password
 *         name:
 *           type: string
 *           description: User name
 *       example:
 *         email: user@example.com
 *         password: securePassword123
 *         name: John Doe
 *
 *     RegisterAdminRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Admin email
 *         password:
 *           type: string
 *           format: password
 *           description: Admin password
 *         name:
 *           type: string
 *           description: Admin name
 *       example:
 *         email: admin@example.com
 *         password: secureAdminPass123
 *         name: Admin User
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         password:
 *           type: string
 *           format: password
 *           description: User password
 *       example:
 *         email: user@example.com
 *         password: securePassword123
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *         email:
 *           type: string
 *           description: User email
 *         name:
 *           type: string
 *           description: User name
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: User role
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         id: 60d21b4667d0d8992e610c85
 *         email: user@example.com
 *         name: John Doe
 *         role: user
 *         createdAt: 2023-06-22T10:30:15.123Z
 *         updatedAt: 2023-06-22T10:30:15.123Z
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         token:
 *           type: string
 *           description: JWT token
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 *       example:
 *         message: Login successful
 *         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         user:
 *           id: 60d21b4667d0d8992e610c85
 *           email: user@example.com
 *           name: John Doe
 *           role: user
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *       example:
 *         error: Invalid email or password
 */

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/register/user:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 userId:
 *                   type: string
 *                   example: 60d21b4667d0d8992e610c85
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/register/admin:
 *   post:
 *     summary: Register a new admin
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterAdminRequest'
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Admin registered successfully
 *                 userId:
 *                   type: string
 *                   example: 60d21b4667d0d8992e610c86
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user and receive a JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
