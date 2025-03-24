const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const { JWT_ACCESS_KEY } = require('../config/env');

const authenticateUser = (req, res, next) => {
    try {
        const accessToken =
            req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

        if (!accessToken) throw createHttpError(401, 'You are not logged in');

        const decoded = jwt.verify(accessToken, JWT_ACCESS_KEY);

        if (!decoded) throw createHttpError(401, 'You are not logged in');

        req.user = decoded;
        next();
    } catch (error) {
        console.error('Middleware Error:', error);
        next(error);
    }
};

const isLoggedOut = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (token) {
            try {
                const decoded = jwt.verify(token, JWT_ACCESS_KEY);
                if (decoded) {
                    return next(
                        createHttpError(401, 'You are already logged in'),
                    );
                }
            } catch (verifyError) {
                console.log(verifyError);
            }
        }

        return next();
    } catch (error) {
        return next(error);
    }
};

const authorizeAdmin = (req, res, next) => {
    console.log(req.user.role);
    try {
        if (req.user.role !== 'admin') {
            throw createHttpError(
                403,
                'You are not authorized. Only admin can access',
            );
        }

        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    authenticateUser,
    isLoggedOut,
    authorizeAdmin,
};
