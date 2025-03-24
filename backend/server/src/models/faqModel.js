const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const faqSchema = new Schema(
    {
        question: {
            type: String,
            required: true,
            trim: true,
        },
        answer: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: ['general', 'payments', 'shipping', 'returns', 'account'], // Example categories
            default: 'general',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0, // Default order value
        },
    },
    { timestamps: true, versionKey: false },
);

const FAQ = mongoose.models.FAQ || model('FAQ', faqSchema);

module.exports = FAQ;
