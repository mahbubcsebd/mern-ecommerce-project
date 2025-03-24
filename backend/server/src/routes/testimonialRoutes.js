const express = require('express');

const testimonialRoutes = express.Router();

const { authenticateUser, authorizeAdmin } = require('../middlewares/auth');
const {
    createTestimonial,
    getAllTestimonials,
    updateTestimonialStatus,
    deleteTestimonial,
} = require('../controllers/testimonialController');

// Create a testimonial (authenticated users only)
testimonialRoutes.post('/', authenticateUser, createTestimonial);

// Get all testimonials (public access, with optional status filtering)
testimonialRoutes.get('/', getAllTestimonials);

// Update testimonial status (admin-only)
testimonialRoutes.put(
    '/:testimonialId/status',
    authenticateUser,
    authorizeAdmin,
    updateTestimonialStatus,
);

// Delete a testimonial (admin-only)
testimonialRoutes.delete(
    '/:testimonialId',
    authenticateUser,
    authorizeAdmin,
    deleteTestimonial,
);

module.exports = testimonialRoutes;
