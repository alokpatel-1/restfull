/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: User first name
 *         lastName:
 *           type: string
 *           description: User last name
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *       example:
 *         firstName: Updated
 *         lastName: Name
 *         email: updated@example.com
 *
 *     UpdatePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           format: password
 *           description: Current user password
 *         newPassword:
 *           type: string
 *           format: password
 *           description: New user password
 *       example:
 *         currentPassword: oldPassword123
 *         newPassword: newSecurePassword456
 *
 *     UserSettings:
 *       type: object
 *       properties:
 *         notifications:
 *           type: boolean
 *           description: Notification preferences
 *         theme:
 *           type: string
 *           description: UI theme preference
 *         language:
 *           type: string
 *           description: Language preference
 *       example:
 *         notifications: true
 *         theme: light
 *         language: en
 *
 *     UserDashboard:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         user:
 *           $ref: '#/components/schemas/UserResponse'
 *       example:
 *         message: User dashboard accessed successfully
 *         user:
 *           id: 60d21b4667d0d8992e610c85
 *           email: user@example.com
 *           firstName: John
 *           lastName: Doe
 *           role: user
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User-specific endpoints
 */

/**
 * @swagger
 * /users/dashboard:
 *   get:
 *     summary: Get user dashboard
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard accessed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDashboard'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
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
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 user:
 *                   $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /users/password:
 *   put:
 *     summary: Update user password
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       200:
 *         description: Password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password updated successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /users/profile/settings:
 *   get:
 *     summary: Get user settings
 *     tags: [Users]
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
 *                   example: User settings retrieved successfully
 *                 settings:
 *                   $ref: '#/components/schemas/UserSettings'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - User role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
