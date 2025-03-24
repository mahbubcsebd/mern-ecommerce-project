/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const User = require('./userModel');
const Product = require('./productModel');

const ReviewSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        image: {
            type: String, // Assuming you store the image URL
            required: false, // Optional field
        },
    },
    { timestamps: true, versionKey: false },
);

const Review = mongoose.models.reviews || model('Review', ReviewSchema);

module.exports = Review;
