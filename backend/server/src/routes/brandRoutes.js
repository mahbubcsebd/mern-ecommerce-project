const express = require('express');

const brandRoutes = express.Router();

const {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
} = require('../controllers/brandController');

// Create a brand
brandRoutes.post('/', createBrand);

// Get all brands
brandRoutes.get('/', getAllBrands);

// Get a brand by ID
brandRoutes.get('/:id', getBrandById);

// Update a brand by ID
brandRoutes.put('/:id', updateBrand);

// Delete a brand by ID
brandRoutes.delete('/:id', deleteBrand);

module.exports = brandRoutes;
