/* eslint-disable no-shadow */
const createHttpError = require('http-errors');
const {
    successResponse,
    errorResponse,
} = require('../helpers/responseHandler');

const Product = require('../models/productModel');
const Review = require('../models/reviewModel');

// Create a new review
const createReview = async (req, res) => {
    try {
        const { slug } = req.params; // Use slug instead of id
        const { rating, comment } = req.body;

        const userId = req.user.id;

        // Validate input
        if (!rating || !comment) {
            throw createHttpError(400, 'Please provide all required fields.');
        }

        // Validate rating (must be between 1 and 5)
        if (rating < 1 || rating > 5) {
            throw createHttpError(400, 'Rating must be between 1 and 5.');
        }

        // Find the product by slug
        const product = await Product.findOne({ slug });
        if (!product) {
            throw createHttpError(404, 'Product not found.');
        }

        // Check if the user has already reviewed this product
        const existingReview = await Review.findOne({
            user: userId,
            product: product._id,
        });
        if (existingReview) {
            throw createHttpError(
                400,
                'You have already reviewed this product.',
            );
        }

        // Create the review
        const review = await Review.create({
            user: userId,
            product: product._id,
            rating,
            comment,
        });

        // Add the review to the product
        product.reviews.push(review._id);

        // Recalculate the average rating
        const reviews = await Review.find({ product: product._id });
        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0,
        );
        product.ratings = totalRating / reviews.length;

        // Save the updated product
        await product.save();

        // Populate user details in the review response
        const populatedReview = await Review.findById(review._id).populate(
            'user',
            'name email',
        );

        return successResponse(res, {
            statusCode: 201,
            message: 'Review created successfully',
            data: { populatedReview },
        });
    } catch (error) {
        console.error('Error in addReview:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// Get all reviews
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();
        // .populate('user', 'firstName lastName email avatar')
        // .populate('product');

        return successResponse(res, {
            statusCode: 200,
            message: 'Reviews fetched successfully',
            data: { reviews },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// Get a single review by ID
const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        // .populate('user')
        // .populate('product');

        if (!review) {
            throw createHttpError(404, 'Review not found.');
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'Product fetched successfully',
            data: { review },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// Update a review
const updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body; // Only allow rating and comment to be updated
        const { id } = req.params; // Review ID from URL params

        // Validate input
        if (!rating || !comment) {
            throw createHttpError(400, 'Please provide all required fields.');
        }

        // Validate rating (must be between 1 and 5)
        if (rating < 1 || rating > 5) {
            throw createHttpError(400, 'Rating must be between 1 and 5.');
        }

        // Find the review by ID
        const review = await Review.findById(id);
        if (!review) {
            throw createHttpError(404, 'Review not found.');
        }

        // Update the review
        review.rating = rating;
        review.comment = comment;
        await review.save();

        // Find the associated product
        const product = await Product.findById(review.product);
        if (!product) {
            throw createHttpError(404, 'Review not found.');
        }

        // Recalculate the average rating for the product
        const reviews = await Review.find({ product: product._id });
        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0,
        );
        product.ratings = totalRating / reviews.length;

        // Save the updated product
        await product.save();

        // Populate user details in the updated review response
        const populatedReview = await Review.findById(review._id).populate(
            'user',
            'name email avatar',
        );

        return successResponse(res, {
            statusCode: 200,
            message: 'Review updated successfully',
            data: { populatedReview },
        });
    } catch (error) {
        console.error('Error in updateReview:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// Delete a review
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params; // Review ID from URL params

        // Find the review by ID and delete it
        const review = await Review.findByIdAndDelete(id);
        if (!review) {
            throw createHttpError(404, 'Review not found.');
        }

        // Find the associated product
        const product = await Product.findById(review.product);
        if (!product) {
            throw createHttpError(404, 'Product not found.');
        }

        // Remove the review ID from the product's reviews array
        product.reviews = product.reviews.filter(
            (review) => review.toString() !== id,
        );

        // Recalculate the average rating for the product
        const reviews = await Review.find({ product: product._id });
        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0,
        );
        product.ratings = reviews.length > 0 ? totalRating / reviews.length : 0; // Handle case when no reviews are left

        // Save the updated product
        await product.save();

        return successResponse(res, {
            statusCode: 200,
            message: 'Review deleted successfully',
        });
    } catch (error) {
        console.error('Error in deleteReview:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

module.exports = {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
};
