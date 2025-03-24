const express = require('express');

const userRoutes = express.Router();
const {
    validateUserUpdate,
    validateUpdatePassword,
} = require('../validators/userValidator');

const {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    verifyUser,
    getUserProfile,
    toggleBanUser,
    forgotPassword,
    resetPassword,
    updatePassword,
    updateProfilePicture,
} = require('../controllers/userController');

const runValidation = require('../middlewares/validate');

const {
    authenticateUser,
    authorizeAdmin,
    isLoggedOut,
} = require('../middlewares/auth');
const { singleImageUpload } = require('../middlewares/multer');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Error getting users
 */
userRoutes.get('/', authenticateUser, authorizeAdmin, getAllUsers);

userRoutes.get('/me', authenticateUser, getUserProfile);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: User not found
 */
userRoutes.get('/:id', authenticateUser, getUserById);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - phone
 *               - role
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
userRoutes.post('/', createUser);

userRoutes.post('/verify', verifyUser);

userRoutes.put(
    '/update-avatar',
    authenticateUser, // Ensure the user is authenticated
    singleImageUpload('avatars', 'avatar', {
        transformation: { width: 150, height: 150, crop: 'thumb' }, // Custom transformation
        limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
    }),
    updateProfilePicture,
);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
userRoutes.put(
    '/:id',
    authenticateUser,
    validateUserUpdate,
    runValidation,
    updateUser,
);

userRoutes.put(
    '/toggle-ban/:userId',
    authenticateUser,
    authorizeAdmin,
    toggleBanUser,
);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
userRoutes.delete('/:id', authenticateUser, authorizeAdmin, deleteUser);

// Forgot password
userRoutes.post(
    '/update-password',
    authenticateUser,
    validateUpdatePassword,
    runValidation,
    updatePassword,
);

// Forgot password
userRoutes.post('/forgot-password', isLoggedOut, forgotPassword);

// Forgot password
userRoutes.post('/reset-password', isLoggedOut, resetPassword);

module.exports = userRoutes;
