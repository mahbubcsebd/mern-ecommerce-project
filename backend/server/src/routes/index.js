const express = require('express');

const routes = express.Router();

// Import all route files
const authRoutes = require('./authRoutes');
const brandRoutes = require('./brandRoutes');
const categoryRoutes = require('./categoryRoutes');
const productRoutes = require('./productRoutes');
const reviewRoutes = require('./reviewRoutes');
const testimonialRoutes = require('./testimonialRoutes');
const userRoutes = require('./userRoutes');
const heroRoutes = require('./heroRoutes');
const faqRoutes = require('./faqRoutes');

// Use routes
routes.use('/auth', authRoutes);
routes.use('/users', userRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/brands', brandRoutes);
routes.use('/products', productRoutes);
routes.use('/reviews', reviewRoutes);
routes.use('/testimonials', testimonialRoutes);
routes.use('/heroes', heroRoutes);
routes.use('/faqs', faqRoutes);

module.exports = routes;
