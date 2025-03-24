/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const slugify = require('slugify');
const { Schema, model } = require('mongoose');
const validate = require('validator');

const User = require('./userModel');
const Category = require('./categoryModel');
const Brand = require('./brandModel');
const Review = require('./reviewModel');

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            unique: true, // Ensure slugs are unique
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        discountType: {
            type: String,
            enum: ['flat', 'percentage'], // Only allow 'flat' or 'percentage'
            default: null,
        },
        discountValue: {
            type: Number,
            default: 0,
        },
        discountedPrice: {
            type: Number,
            default() {
                if (this.discountType === 'flat') {
                    return this.price - this.discountValue;
                }
                if (this.discountType === 'percentage') {
                    return this.price * (1 - this.discountValue / 100);
                }
                return this.price; // No discount
            },
        },
        stock: {
            type: Number,
            required: true,
        },
        images: [
            {
                type: String,
                default: null,
            },
        ],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        brand: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Brand',
            required: true,
        },
        attributes: {
            type: Map, // Dynamic key-value pairs
            of: String,
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Review',
            },
        ],
        ratings: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true, versionKey: false },
);

// Pre-save hook to generate and ensure unique slug
productSchema.pre('save', async (next) => {
    if (!this.isModified('name')) return next(); // Skip if name is not modified

    const slug = slugify(this.name, { lower: true, strict: true });
    let uniqueSlug = slug;

    // Check if a product with the same slug already exists
    let count = 1;
    while (true) {
        // eslint-disable-next-line no-use-before-define, no-await-in-loop
        const existingProduct = await Product.findOne({ slug: uniqueSlug });
        if (!existingProduct) break; // Slug is unique
        uniqueSlug = `${slug}-${count}`; // Add suffix to make it unique
        // eslint-disable-next-line no-plusplus
        count++;
    }

    this.slug = uniqueSlug;
    return next();
});

const Product = mongoose.models.products || model('Product', productSchema);

module.exports = Product;
