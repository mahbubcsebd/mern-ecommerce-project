const express = require('express');

const authRoutes = express.Router();

const {
    loginUser,
    logoutUser,
    refreshTokenGenerate,
    protectedRoute,
} = require('../controllers/authController');
const { isLoggedOut, authenticateUser } = require('../middlewares/auth');

// Login user
authRoutes.post('/login', isLoggedOut, loginUser);

// Logout user
authRoutes.post('/logout', authenticateUser, logoutUser);

// generate refresh token
authRoutes.get('/refresh-token', refreshTokenGenerate);

// protected route
authRoutes.get('/protected', protectedRoute);

module.exports = authRoutes;
