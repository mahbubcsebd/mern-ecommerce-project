const express = require('express');

const faqRoutes = express.Router();
const {
    createFAQ,
    getAllFAQs,
    getFAQById,
    updateFAQ,
    deleteFAQ,
    reorderFAQs, // Add this
} = require('../controllers/faqController');

// Create a FAQ
faqRoutes.post('/', createFAQ);

// Get all FAQs
faqRoutes.get('/', getAllFAQs);

// Get a FAQ by ID
faqRoutes.get('/:id', getFAQById);

// Update a FAQ by ID
faqRoutes.put('/:id', updateFAQ);

// Delete a FAQ by ID
faqRoutes.delete('/:id', deleteFAQ);

// Reorder FAQs
faqRoutes.post('/reorder', reorderFAQs); // Add this route

module.exports = faqRoutes;
