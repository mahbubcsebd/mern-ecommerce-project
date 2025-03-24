const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const BrandSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        logo: {
            type: String,
        },
        website: {
            type: String,
        },
        discountType: {
            type: String,
            enum: ['flat', 'percentage'],
            default: null,
        },
        discountValue: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true, versionKey: false },
);

const Brand = mongoose.models.brands || model('Brand', BrandSchema);

module.exports = Brand;
