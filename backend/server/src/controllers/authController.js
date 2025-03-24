const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const {
    successResponse,
    errorResponse,
} = require('../helpers/responseHandler');
// const deleteImage = require('../helpers/deleteImage');
const { createJsonWebToken } = require('../helpers/jsonWebToken');
const { JWT_ACCESS_KEY, JWT_REFRESH_KEY } = require('../config/env');
// const sendEmail = require('../helpers/email');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            throw createHttpError(400, 'Email and password are required.');
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw createHttpError(
                400,
                'User does not exist. Please sign up first.',
            );
        }

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw createHttpError(401, 'Email or password does not match.');
        }

        // Check if user is banned
        if (user.isBanned) {
            throw createHttpError(400, 'You are banned. Please contact admin.');
        }

        const tokenData = { id: user._id, role: user.role || 'user' };
        // Generate JWT access token for 15 minutes
        const accessToken = createJsonWebToken(
            tokenData,
            JWT_ACCESS_KEY,
            '15m',
        );

        // Generate JWT access token for 15 minutes
        const refreshToken = createJsonWebToken(
            tokenData,
            JWT_REFRESH_KEY,
            '7d',
        );

        // Set access token on cookie securely
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000, // 15 minutes
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        // Set refresh token on cookie securely
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        const userWithoutPassword = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };

        return successResponse(res, {
            statusCode: 200,
            message: 'Login Successful',
            data: {
                user: userWithoutPassword,
                accessToken,
            },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

// Logout Controller
const logoutUser = async (req, res) => {
    try {
        // Clear cookie
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        return successResponse(res, {
            statusCode: 200,
            message: 'Logout Successful',
            data: {},
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

// Generate refresh token
const refreshTokenGenerate = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            throw createHttpError(401, 'Refresh token is missing');
        }

        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_KEY);

        if (!decoded) {
            throw createHttpError(
                401,
                'Refresh token invalid! Please login again',
            );
        }

        // Extract user data from decoded token
        const tokenData = { id: decoded.id, role: decoded.role };

        // Generate a new access token
        const accessToken = createJsonWebToken(
            tokenData, // ✅ Match loginUser data
            JWT_ACCESS_KEY,
            '15m',
        );

        // Set access token on cookie securely
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        return successResponse(res, {
            statusCode: 200,
            message: 'Access token generated successfully',
            data: { accessToken },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// protected
const protectedRoute = async (req, res) => {
    try {
        const { accessToken } = req.cookies;

        if (!accessToken) {
            throw createHttpError(401, 'Access token is missing. Please login');
        }

        const decodedToken = jwt.verify(accessToken, JWT_ACCESS_KEY);

        if (!decodedToken) {
            throw createHttpError(
                401,
                'Invalid Access token! Please login again.',
            );
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'Protected resourcess accessed successfully',
            data: {},
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

module.exports = {
    loginUser,
    logoutUser,
    refreshTokenGenerate,
    protectedRoute,
};
