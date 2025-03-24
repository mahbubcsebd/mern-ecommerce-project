const express = require('express');

const categoryRoutes = express.Router();

const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getSubcategories,
} = require('../controllers/categoryController');

// Create a category
categoryRoutes.post('/', createCategory);

// Get all categories
categoryRoutes.get('/', getAllCategories);

// Get a category by ID
categoryRoutes.get('/:id', getCategoryById);

// Update a category by ID
categoryRoutes.put('/:id', updateCategory);

// Delete a category by ID
categoryRoutes.delete('/:id', deleteCategory);

// Get subcategories for a specific category
categoryRoutes.get('/subcategories/:parentId', getSubcategories);

module.exports = categoryRoutes;
