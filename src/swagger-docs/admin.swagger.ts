/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserStatusRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [active, blocked]
 *           description: User status
 *       example:
 *         status: blocked
 *
 *     SystemSettings:
 *       type: object
 *       properties:
 *         maintenance:
 *           type: boolean
 *           description: System maintenance mode
 *         registrationEnabled:
 *           type: boolean
 *           description: Whether user registration is enabled
 *         maxLoginAttempts:
 *           type: integer
 *           description: Maximum login attempts before account lockout
 *       example:
 *         maintenance: false
 *         registrationEnabled: true
 *         maxLoginAttempts: 5
 *
 *     AdminDashboard:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         admin:
 *           $ref: '#/components/schemas/UserResponse'
 *       example:
 *         message: Admin dashboard accessed successfully
 *         admin:
 *           id: 60d21b4667d0d8992e610c86
 *           email: admin@example.com
 *           firstName: Admin
 *           lastName: User
 *           role: admin
 *
 *     UserList:
 *       type: object
 *       properties:
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserResponse'
 *         total:
 *           type: integer
 *           description: Total number of users
 *       example:
 *         users:
 *           - id: 60d21b4667d0d8992e610c85
 *             email: user@example.com
 *             firstName: John
 *             lastName: Doe
 *             role: user
 *             status: active
 *             createdAt: 2023-06-22T10:30:15.123Z
 *           - id: 60d21b4667d0d8992e610c87
 *             email: another@example.com
 *             firstName: Jane
 *             lastName: Smith
 *             role: user
 *             status: active
 *             createdAt: 2023-06-22T11:45:30.456Z
 *         total: 2
 */

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-specific endpoints
 */

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard accessed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminDashboard'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserList'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /admin/users/{id}/status:
 *   put:
 *     summary: Update user status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserStatusRequest'
 *     responses:
 *       200:
 *         description: User status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User status updated successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     status:
 *                       type: string
 *                       example: blocked
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2023-06-23T14:25:10.123Z
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /admin/settings:
 *   get:
 *     summary: Get system settings
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: System settings retrieved successfully
 *                 settings:
 *                   $ref: '#/components/schemas/SystemSettings'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
