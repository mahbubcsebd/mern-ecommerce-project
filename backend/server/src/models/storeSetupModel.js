const mongoose = require('mongoose');

const heroSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        subtitle: {
            type: String,
            trim: true,
        },
        image: {
            type: String, // Ensure this is a valid image URL
            required: true,
        },
        link: {
            type: String,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }, // Adds createdAt and updatedAt fields
);

const Hero = mongoose.model('Hero', heroSchema);
module.exports = Hero;
