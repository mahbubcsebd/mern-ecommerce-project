const express = require('express');

const reviewRoutes = express.Router();

const { authenticateUser, authorizeAdmin } = require('../middlewares/auth');

const {
    createReview,
    getAllReviews,
    getReviewById,
    updateReview,
    deleteReview,
} = require('../controllers/reviewController');

// Create a new review
reviewRoutes.post('/:slug', authenticateUser, createReview);

// Get all reviews
reviewRoutes.get('/', getAllReviews);

// Get a single review by ID
reviewRoutes.get('/:id', getReviewById);

// Update a review
reviewRoutes.put('/:id', authenticateUser, updateReview);

// Delete a review
reviewRoutes.delete('/:id', authenticateUser, authorizeAdmin, deleteReview);

module.exports = reviewRoutes;
