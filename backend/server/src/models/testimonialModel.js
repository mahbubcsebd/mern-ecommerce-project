/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');
const User = require('./userModel');
const Product = require('./productModel');

const TestimonialSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        comment: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        image: {
            type: String, // URL of the image (optional)
            default: null,
        },
        video: {
            type: String, // URL of the video (optional)
            default: null,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'], // Admin can approve or reject testimonials
            default: 'pending',
        },
    },
    { timestamps: true, versionKey: false },
);

const Testimonial =
    mongoose.models.testimonials || model('Testimonial', TestimonialSchema);

module.exports = Testimonial;
