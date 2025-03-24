/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');
const validate = require('validator');
const { defaultImagePath } = require('../config/env');

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minLenght: [2, 'Name must be more than 2 characters'],
            maxlength: [25, 'Name must be less than 25 characters'],
        },
        lastName: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minLenght: [2, 'Name must be more than 2 characters'],
            maxlength: [25, 'Name must be less than 25 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            unique: true,
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
            minLenght: [8, 'Password must be more than 8 characters'],
        },
        avatar: {
            type: String,
            default:
                'https://res.cloudinary.com/your_cloud_name/image/upload/v123456789/default-profile-picture.png',
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'moderator'],
            default: 'user',
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true, versionKey: false },
);

const User = mongoose.models.users || mongoose.model('User', userSchema);

module.exports = User;
