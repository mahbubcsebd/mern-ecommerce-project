const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
// const validate = require('validator');

const tempUserSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'First name is required'],
            trim: true,
            minLength: [2, 'First name must be more than 2 characters'],
            maxLength: [25, 'First name must be less than 25 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required'],
            trim: true,
            minLength: [2, 'Last name must be more than 2 characters'],
            maxLength: [25, 'Last name must be less than 25 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            validate: {
                validator(value) {
                    const emailRegex = /^([\w-\\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
                    return emailRegex.test(value);
                },
                message: 'Email is not valid',
            },
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minLength: [8, 'Password must be more than 8 characters'],
        },
        verificationToken: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
            expires: 3600, // Automatically remove document after 1 hour
        },
    },
    { timestamps: true, versionKey: false },
);

const TempUser = mongoose.models.tempusers || model('TempUser', tempUserSchema);

module.exports = TempUser;
