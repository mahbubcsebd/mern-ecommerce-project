/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const User = require('./userModel');

const resetPasswordShema = new Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        token: { type: String, required: true },
        expiresAt: { type: Date, required: true },
    },
    { versionKey: false },
);

// Add TTL index for automatic deletion of expired tokens
resetPasswordShema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PasswordResetToken =
    mongoose.models.PasswordResetToken ||
    model('PasswordResetToken', resetPasswordShema);

module.exports = PasswordResetToken;
