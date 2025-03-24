const createHttpError = require('http-errors');
const {
    errorResponse,
    successResponse,
} = require('../helpers/responseHandler');
const Testimonial = require('../models/testimonialModel');

// Create a new testimonial
const createTestimonial = async (req, res) => {
    try {
        const { comment, rating, image, video } = req.body;
        const userId = req.user.id; // Assuming user ID is available in the request

        // Validate input
        if (!comment || !rating) {
            throw createHttpError(400, 'Please provide all required fields.');
        }

        // Validate rating
        if (rating < 1 || rating > 5) {
            throw createHttpError(400, 'Rating must be between 1 and 5.');
        }

        // Create the testimonial
        const testimonial = await Testimonial.create({
            user: userId,
            comment,
            rating,
            image,
            video,
        });

        return successResponse(res, {
            statusCode: 201,
            message: 'Testimonial created successfully',
            data: { testimonial },
        });
    } catch (error) {
        console.error('Error in createTestimonial:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// Get all testimonials (with optional filtering by status)
const getAllTestimonials = async (req, res) => {
    try {
        const { status } = req.query; // Optional query parameter to filter by status

        const filter = {};
        if (status) {
            filter.status = status;
        }

        const testimonials = await Testimonial.find(filter)
            .populate('user', 'name email avatar') // Populate user details
            .sort({ createdAt: -1 }); // Sort by latest first

        return successResponse(res, {
            statusCode: 200,
            message: 'Testimonial fetched successfully',
            data: { testimonials },
        });
    } catch (error) {
        console.error('Error in getAllTestimonials:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// Update testimonial status (admin-only)
const updateTestimonialStatus = async (req, res) => {
    try {
        const { testimonialId } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            throw createHttpError(400, 'Invalid status.');
        }

        // Update the testimonial status
        const testimonial = await Testimonial.findByIdAndUpdate(
            testimonialId,
            { status },
            { new: true, runValidators: true },
        );

        if (!testimonial) {
            throw createHttpError(400, 'Testimonial not found!');
        }

        res.status(200).json({
            success: true,
            message: 'Testimonial status updated successfully',
            data: testimonial,
        });
        return successResponse(res, {
            statusCode: 200,
            message: 'Testimonial status updated successfully',
            data: { testimonial },
        });
    } catch (error) {
        console.error('Error in updateTestimonialStatus:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// Delete a testimonial (admin-only)
const deleteTestimonial = async (req, res) => {
    try {
        const { testimonialId } = req.params;

        const testimonial = await Testimonial.findByIdAndDelete(testimonialId);

        if (!testimonial) {
            throw createHttpError(404, 'Testimonial not found.');
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'Testimonial deleted successfully',
        });
    } catch (error) {
        console.error('Error in deleteTestimonial:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

module.exports = {
    createTestimonial,
    getAllTestimonials,
    updateTestimonialStatus,
    deleteTestimonial,
};
