/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const createHttpError = require('http-errors');
const FAQ = require('../models/faqModel');
const {
    successResponse,
    errorResponse,
} = require('../helpers/responseHandler');

const createFAQ = async (req, res, next) => {
    try {
        const { question, answer, category } = req.body;

        // Validate required fields
        if (!question || !answer) {
            return next(
                createHttpError(400, 'Question and Answer are required'),
            );
        }

        // Find the current maximum order value
        const lastFAQ = await FAQ.findOne().sort({ order: -1 });
        const newOrder = lastFAQ ? lastFAQ.order + 1 : 0;

        // Create the FAQ
        const newFAQ = await FAQ.create({
            question,
            answer,
            category,
            order: newOrder, // Set the initial order
        });

        return successResponse(res, {
            statusCode: 201,
            message: 'FAQ created successfully',
            data: { newFAQ },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

const getAllFAQs = async (req, res) => {
    try {
        const { category, isActive } = req.query;

        // Build the query
        const query = {};
        if (category && category !== 'all') query.category = category;
        if (isActive !== undefined) {
            // Convert string to boolean if it's 'true' or 'false'
            if (isActive === 'true') query.isActive = true;
            if (isActive === 'false') query.isActive = false;
        }

        // Fetch FAQs sorted by order field (ascending)
        const faqs = await FAQ.find(query).sort({ order: 1 });

        return successResponse(res, {
            statusCode: 200,
            message: 'FAQs fetched successfully',
            data: faqs,
        });
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

const getFAQById = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find the FAQ by ID
        const faq = await FAQ.findById(id);

        if (!faq) {
            return next(createHttpError(404, 'FAQ not found'));
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'FAQ fetched successfully',
            data: faq,
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

const updateFAQ = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { question, answer, category, isActive } = req.body;

        // Find and update the FAQ
        const updatedFAQ = await FAQ.findByIdAndUpdate(
            id,
            { question, answer, category, isActive },
            { new: true, runValidators: true }, // Return the updated FAQ and run validators
        );

        if (!updatedFAQ) {
            return next(createHttpError(404, 'FAQ not found'));
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'FAQ updated successfully',
            data: updatedFAQ,
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

const deleteFAQ = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Find and delete the FAQ
        const deletedFAQ = await FAQ.findByIdAndDelete(id);

        if (!deletedFAQ) {
            return next(createHttpError(404, 'FAQ not found'));
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'FAQ deleted successfully',
            data: deletedFAQ,
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

const reorderFAQs = async (req, res) => {
    try {
        const { orderedIds } = req.body; // Array of FAQ IDs in the new order

        // Validate input
        if (
            !orderedIds ||
            !Array.isArray(orderedIds) ||
            orderedIds.length === 0
        ) {
            return errorResponse(res, {
                statusCode: 400,
                message: 'Invalid or empty orderedIds array provided',
            });
        }

        // Ensure all IDs are valid
        for (const id of orderedIds) {
            const faqExists = await FAQ.exists({ _id: id });
            if (!faqExists) {
                return errorResponse(res, {
                    statusCode: 404,
                    message: `FAQ with ID ${id} not found`,
                });
            }
        }

        // Update the order of each FAQ
        const updates = orderedIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id },
                update: { $set: { order: index } },
            },
        }));

        await FAQ.bulkWrite(updates); // Perform bulk update

        // Fetch the updated FAQs in their new order to return to the client
        const updatedFaqs = await FAQ.find({ _id: { $in: orderedIds } }).sort({
            order: 1,
        });

        return successResponse(res, {
            statusCode: 200,
            message: 'FAQs reordered successfully',
            data: updatedFaqs, // Return the updated data
        });
    } catch (error) {
        console.error('Error reordering FAQs:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

module.exports = {
    createFAQ,
    getAllFAQs,
    getFAQById,
    updateFAQ,
    deleteFAQ,
    reorderFAQs,
};
