const express = require('express');

const productRoutes = express.Router();

const { authenticateUser, authorizeAdmin } = require('../middlewares/auth');

const {
    createProduct,
    getAllProducts,
    updateProduct,
    getProductBySlug,
    deleteProduct,
} = require('../controllers/productController');

// create product
productRoutes.post('/', authenticateUser, authorizeAdmin, createProduct);

// get all products
productRoutes.get('/', getAllProducts);

// get product by id
productRoutes.get('/:slug', getProductBySlug);

// update product
productRoutes.put('/:slug', authenticateUser, authorizeAdmin, updateProduct);

// delete product
productRoutes.delete('/:slug', authenticateUser, authorizeAdmin, deleteProduct);

module.exports = productRoutes;
