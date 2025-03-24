const createHttpError = require('http-errors');
const {
    successResponse,
    errorResponse,
} = require('../helpers/responseHandler');

const Product = require('../models/productModel');
const Review = require('../models/reviewModel');

// create product
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountType,
            discountValue,
            stock,
            category,
            brand,
            attributes,
        } = req.body;

        console.log(req.body.name);

        // Validate required fields
        if (!name || !description || !price || !stock || !category || !brand) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields',
            });
        }

        // Create the product
        const product = await Product.create({
            name,
            description,
            price,
            discountType,
            discountValue,
            stock,
            category,
            brand,
            attributes,
        });

        return successResponse(res, {
            statusCode: 201,
            message: 'Product created successfully',
            data: { product },
        });
    } catch (error) {
        console.error('Error in createProduct:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// get all products
const getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            category,
            brand,
            minPrice,
            maxPrice,
        } = req.query;

        // Build the query
        const query = {};
        if (category) query.category = category;
        if (brand) query.brand = brand;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Fetch products with pagination and sorting
        const products = await Product.find(query)
            .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('category')
            .populate('brand')
            .exec();

        // Count total products for pagination
        const totalProducts = await Product.countDocuments(query);

        return successResponse(res, {
            statusCode: 200,
            message: 'Products fetched successfully',
            data: {
                products,
                totalProducts,
                totalPages: Math.ceil(totalProducts / limit),
                currentPage: Number(page),
            },
        });
    } catch (error) {
        console.error('Error in getAllProducts:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// get product by slug
const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        // Find the product by slug
        const product = await Product.findOne({ slug })
            .populate('category')
            .populate('brand', 'name website')
            .populate({
                path: 'reviews', // Populate reviews
                populate: {
                    path: 'user', // Populate user inside reviews
                    select: 'name email avatar', // Select only name, email, and avatar
                },
            })
            .exec();

        if (!product) {
            throw createHttpError(404, 'Product not found.');
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'Product fetched successfully',
            data: { product },
        });
    } catch (error) {
        console.error('Error in getProductBySlug:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// update product
const updateProduct = async (req, res) => {
    try {
        const { slug } = req.params;
        const {
            name,
            description,
            price,
            discountType,
            discountValue,
            stock,
            category,
            brand,
            attributes,
        } = req.body;

        // Find and update the product
        const product = await Product.findOneAndUpdate(
            { slug },
            {
                name,
                description,
                price,
                discountType,
                discountValue,
                stock,
                category,
                brand,
                attributes,
            },
            { new: true }, // Return the updated product
        );

        if (!product) {
            throw createHttpError(404, 'Product not found.');
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'Product update successfully',
            data: { product },
        });
    } catch (error) {
        console.error('Error in updateProduct:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// delete product
const deleteProduct = async (req, res) => {
    console.log(req.params.slug);
    try {
        const { slug } = req.params;

        // Find and delete the product
        const product = await Product.findOneAndDelete({ slug });

        if (!product) {
            throw createHttpError(404, 'Product not found.');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'Product deleted successfully',
        });
    } catch (error) {
        console.error('Error in deleteProduct:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// add review
const addReview = async (req, res) => {
    try {
        const { slug } = req.params; // Use slug instead of id
        const { rating, comment } = req.body;

        const userId = req.user.id;

        // Validate input
        if (!rating || !comment) {
            throw createHttpError(400, 'Please provide all required field.');
        }

        // Validate rating (must be between 1 and 5)
        if (rating < 1 || rating > 5) {
            throw createHttpError(404, 'Rating must be between 1 and 5.');
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
                404,
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
            // eslint-disable-next-line no-shadow
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
            statusCode: 200,
            message: 'Review added successfully',
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

module.exports = {
    createProduct,
    getAllProducts,
    getProductBySlug,
    updateProduct,
    deleteProduct,
    addReview,
};
