const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const HeroSchema = new Schema(
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
            type: String,
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
    { timestamps: true, versionKey: false },
);

const Hero = mongoose.models.heroes || model('Hero', HeroSchema);

module.exports = Hero;
