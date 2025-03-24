const createHttpError = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const {
    successResponse,
    errorResponse,
} = require('../helpers/responseHandler');
const { createJsonWebToken } = require('../helpers/jsonWebToken');
const {
    JWT_REG_KEY,
    SMTP_USER_NAME,
    CLIENT_URL,
    JWT_ACCESS_KEY,
} = require('../config/env');
const cloudinary = require('../config/cloudinary');
const sendEmail = require('../helpers/email');
const TempUser = require('../models/tempUserModel');
const PasswordResetToken = require('../models/resetPasswordModel');

const DEFAULT_PROFILE_PICTURE =
    'https://res.cloudinary.com/your_cloud_name/image/upload/v123456789/default-profile-picture.png';

const createUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if the email already exists in User or TempUser
        const userExist = await User.exists({ email });
        const tempUserExist = await TempUser.exists({ email });

        if (userExist) {
            return next(
                createHttpError(409, 'User already exists. Please Sign In'),
            );
        }

        if (tempUserExist) {
            return next(
                createHttpError(
                    409,
                    'You are already registered. Please check your email for verification.',
                ),
            );
        }

        // Create JWT token
        const token = createJsonWebToken({ email }, JWT_REG_KEY, '10m');

        // Save to TempUser
        const tempUser = new TempUser({
            firstName,
            lastName,
            email,
            password,
            verificationToken: token,
        });
        await tempUser.save();

        // Send Verification Email
        const activationLink = `${CLIENT_URL}/user-verify/${token}`;
        const emailData = {
            from: SMTP_USER_NAME,
            to: email,
            subject: 'Account Activation Email',
            html: `<p>Hello ${firstName},</p>
                   <p>Please verify your account by clicking the link below:</p>
                   <a href="${activationLink}">Activate Account</a>`,
        };
        await sendEmail(emailData);

        return successResponse(res, {
            statusCode: 200,
            message: `Please check your email: ${email} to activate your account`,
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

const verifyUser = async (req, res, next) => {
    try {
        const { token } = req.body;

        if (!token) {
            return next(createHttpError(400, 'Token not found'));
        }

        // Decode Token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_REG_KEY);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return next(
                    createHttpError(
                        400,
                        'Token expired! Please sign up again.',
                    ),
                );
            }
            if (error.name === 'JsonWebTokenError') {
                return next(createHttpError(400, 'Invalid Token'));
            }
            return next(createHttpError(500, 'Internal server error'));
        }

        console.log(decoded);

        // Check if user already exists
        const userExist = await User.exists({ email: decoded.email });
        if (userExist) {
            return next(
                createHttpError(409, 'User already exists. Please Sign In'),
            );
        }

        // Find temp user
        const tempUser = await TempUser.findOne({
            email: decoded.email,
            verificationToken: token,
        });

        if (!tempUser) {
            return next(createHttpError(400, 'Invalid or expired token'));
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(tempUser.password, 10);

        // Create User
        const user = new User({
            firstName: tempUser.firstName,
            lastName: tempUser.lastName,
            email: tempUser.email,
            password: hashedPassword,
        });

        await user.save();

        // Delete TempUser record only after successful user creation
        await TempUser.deleteOne({ email: decoded.email });

        return successResponse(res, {
            statusCode: 201,
            message: 'User registered successfully',
            data: { user },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        // Extract query parameters
        const {
            page = 1,
            limit = 10,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            role,
            isBanned,
        } = req.query;

        // Convert page and limit to numbers
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const skip = (pageNum - 1) * limitNum;

        // Build filter object
        const filter = {};

        // Add search functionality
        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        // Add role filter if provided
        if (role) {
            filter.role = role;
        }

        // Add banned status filter if provided
        if (isBanned !== undefined) {
            filter.isBanned = isBanned === 'true'; // Convert string to boolean
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Get total count for pagination
        const total = await User.countDocuments(filter);

        // Execute query with pagination, filtering, and sorting
        const users = await User.find(filter)
            .select('-password') // Exclude password field
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        // Calculate pagination values
        const totalPages = Math.ceil(total / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum > 1;

        // Return response
        return successResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Users fetched successfully',
            data: {
                users,
                pagination: {
                    total,
                    page: pageNum,
                    limit: limitNum,
                    totalPages,
                    hasNextPage,
                    hasPrevPage,
                },
            },
        });
    } catch (error) {
        return errorResponse(res, {
            success: false,
            statusCode: error.status || 500,
            message: error.message || 'Error feching all users',
        });
    }
};

// Get user by ID
const getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return next(createHttpError(404, 'User not found'));
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'User fetched successfully',
            data: { user },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Error feching all users',
        });
    }
};

// Update user controller
const updateUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        const authorizeAdmin = req.user.role === 'admin';

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return next(createHttpError(404, 'User not found'));
        }

        // Authorization check
        if (req.user.id !== userId && !authorizeAdmin) {
            return next(
                createHttpError(
                    403,
                    'You do not have permission to update this user',
                ),
            );
        }

        // For regular users, restrict certain fields
        if (!authorizeAdmin) {
            const restrictedFields = ['email', 'role', 'isBanned'];
            restrictedFields.forEach((field) => {
                if (updates[field] !== undefined) {
                    delete updates[field];
                }
            });
        }

        // Password updates should be handled separately for security
        if (updates.password) {
            delete updates.password;
        }

        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true },
        ).select('-password');

        return successResponse(res, {
            statusCode: 200,
            message: 'User updated successfully',
            data: { updatedUser },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

// Ban, Unban User
const toggleBanUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        // find the user
        const user = await User.findById(userId);
        if (!user) {
            return next(createHttpError(404, 'User not found'));
        }

        // toggle ban status
        user.isBanned = !user.isBanned;
        await user.save();

        res.status(200).json({
            message: user.isBanned
                ? 'User has been banned'
                : 'User has been unbanned',
            isBanned: user.isBanned,
        });

        return successResponse(res, {
            statusCode: 200,
            message: user.isBanned
                ? 'User has been banned'
                : 'User has been unbanned',
            data: { isBanned: user.isBanned },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// Delete user controller
const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return next(createHttpError(404, 'User not found'));
        }

        // Optional: Authorization check
        // if (req.user.id !== userId && req.user.role !== 'admin') {
        //     throw createHttpError(403, 'You do not have permission to delete this user');
        // }

        // Delete the user
        await User.findByIdAndDelete(userId);

        return successResponse(res, {
            statusCode: 200,
            message: 'User deleted successfully',
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

const getUserProfile = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ message: 'Invalid user request' });
        }

        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return next(createHttpError(404, 'User not found'));
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'User profile fetched successfully',
            data: { user },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

const updateProfilePicture = async (req, res, next) => {
    try {
        const userId = req.user.id;

        // Check if a file was uploaded
        if (!req.file) {
            return next(createHttpError(400, 'No file uploaded'));
        }

        // Find the user
        const user = await User.findById(userId);
        if (!user) {
            return next(createHttpError(404, 'User not found'));
        }

        // If the user already has a profile picture (and it's not the default), delete it from Cloudinary
        if (user.avatar && user.avatar !== DEFAULT_PROFILE_PICTURE) {
            // Extract the public ID from the Cloudinary URL
            const publicId = user.avatar
                .split('/')
                .slice(-2)
                .join('/')
                .split('.')[0];

            // Delete the old profile picture from Cloudinary
            await cloudinary.uploader.destroy(publicId);
        }

        // Update the user's profile picture URL
        user.avatar = req.file.path; // Cloudinary URL is stored in req.file.path
        await user.save();

        return successResponse(res, {
            statusCode: 200,
            message: 'Profile picture updated successfully',
            data: { avatar: user.avatar },
        });
    } catch (error) {
        console.error('Error in updateProfilePicture:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

const updatePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id; // Assuming you have the user ID from the authentication middleware

        // Find the user
        const user = await User.findById(userId).select('+password'); // Include the password field
        if (!user) {
            return next(createHttpError(404, 'User not found'));
        }

        // Verify the current password
        const isPasswordValid = await bcrypt.compare(
            currentPassword,
            user.password,
        );
        if (!isPasswordValid) {
            return next(createHttpError(400, 'Current password is incorrect'));
        }

        // Ensure the new password is different from the current password
        const isSamePassword = await bcrypt.compare(newPassword, user.password);
        if (isSamePassword) {
            return next(
                createHttpError(
                    400,
                    'New password must be different from the current password',
                ),
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password
        user.password = hashedPassword;
        await user.save();

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });

        return successResponse(res, {
            statusCode: 200,
            message: 'Password updated successfully',
        });
    } catch (error) {
        console.error('Error in updatePassword:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// ✅ Forgot Password Controller
const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return next(
                createHttpError(
                    404,
                    'If the email exists, a reset link will be sent',
                ),
            );
        }

        // Generate a password reset token
        const resetToken = createJsonWebToken(
            { id: user._id },
            JWT_ACCESS_KEY,
            '10m',
        );

        // Save the reset token & expiration in the PasswordResetToken collection
        await PasswordResetToken.create({
            userId: user._id,
            token: resetToken,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
        });

        // Send the reset password email
        const resetLink = `${CLIENT_URL}/reset-password/${resetToken}`;
        const emailData = {
            from: process.env.SMTP_USER_NAME,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Hello ${user.firstName},</p>
                   <p>You have requested to reset your password. Please click the link below:</p>
                   <a href="${resetLink}">Reset Password</a>
                   <p>This link will expire in 10 minutes.</p>`,
        };
        await sendEmail(emailData);

        console.log(`Password reset link sent to ${email}`);

        return successResponse(res, {
            statusCode: 200,
            message: 'Password reset link has been sent to your email',
        });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: 'An error occurred while processing your request',
        });
    }
};

// ✅ Reset Password Controller
const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        // Find the token in the PasswordResetToken collection
        const resetTokenDoc = await PasswordResetToken.findOne({
            token,
            expiresAt: { $gt: Date.now() }, // Ensure token is not expired
        });

        if (!resetTokenDoc) {
            return next(createHttpError(400, 'Invalid or expired reset token'));
        }

        // Find the user
        const user = await User.findById(resetTokenDoc.userId);
        if (!user) {
            return next(createHttpError(404, 'User not found'));
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        // Delete the reset token document
        await PasswordResetToken.deleteOne({ _id: resetTokenDoc._id });

        return successResponse(res, {
            statusCode: 200,
            message: 'Password has been reset successfully',
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    toggleBanUser,
    deleteUser,
    verifyUser,
    getUserProfile,
    updateProfilePicture,
    updatePassword,
    forgotPassword,
    resetPassword,
};
