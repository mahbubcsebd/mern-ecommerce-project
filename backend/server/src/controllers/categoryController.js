const createHttpError = require('http-errors');
const {
    successResponse,
    errorResponse,
} = require('../helpers/responseHandler');

const Category = require('../models/categoryModel');

// create category
const createCategory = async (req, res) => {
    try {
        const {
            name,
            description,
            image,
            parentId,
            discountType,
            discountValue,
        } = req.body;

        // Validate required fields
        if (!name) {
            throw createHttpError(400, 'Category name is required.');
        }

        // Check if the category already exists
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            throw createHttpError(400, 'Category already exists.');
        }

        // Create the category
        const category = await Category.create({
            name,
            description,
            image,
            parentId,
            discountType,
            discountValue,
        });
        return successResponse(res, {
            statusCode: 201,
            message: 'Category created successfully',
            data: { category },
        });
    } catch (error) {
        console.error('Error in create Category:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// get all category
const getAllCategories = async (req, res) => {
    try {
        // Fetch all categories
        const categories = await Category.find();

        return successResponse(res, {
            statusCode: 200,
            message: 'Category fetched successfully',
            data: { categories },
        });
    } catch (error) {
        console.error('Error in getAllCategories:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// get single category by id
const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the category by ID
        const category = await Category.findById(id);

        if (!category) {
            throw createHttpError(404, 'Category not found.');
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'Category fetched successfully',
            data: { category },
        });
    } catch (error) {
        console.error('Error in getCategoryById:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// update category
const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            image,
            parentId,
            discountType,
            discountValue,
        } = req.body;

        // Create an update object with only the provided fields
        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (description !== undefined) updateFields.description = description;
        if (image !== undefined) updateFields.image = image;
        if (parentId !== undefined) updateFields.parentId = parentId;
        if (discountType !== undefined)
            updateFields.discountType = discountType;
        if (discountValue !== undefined)
            updateFields.discountValue = discountValue;

        // Find and update the category
        const category = await Category.findByIdAndUpdate(
            id,
            updateFields, // Only update the provided fields
            { new: true }, // Return the updated category
        );

        if (!category) {
            throw createHttpError(404, 'Category not found.');
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'Category updated successfully',
            data: { category },
        });
    } catch (error) {
        console.error('Error in updateCategory:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// delete category
const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the category
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            throw createHttpError(404, 'Category not found.');
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
        return successResponse(res, {
            statusCode: 200,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.error('Error in deleteCategory:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// get sub categories
const getSubcategories = async (req, res) => {
    try {
        const { parentId } = req.params;

        // Find subcategories by parentId
        const subcategories = await Category.find({ parentId });

        return successResponse(res, {
            statusCode: 200,
            message: 'Subcategories fetched successfully',
            data: { subcategories },
        });
    } catch (error) {
        console.error('Error in getSubcategories:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getSubcategories,
};
