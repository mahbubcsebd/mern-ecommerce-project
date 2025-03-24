const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
        parentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
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

const Category =
    mongoose.models.categories || model('Category', CategorySchema);

module.exports = Category;
