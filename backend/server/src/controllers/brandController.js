const createHttpError = require('http-errors');
const {
    successResponse,
    errorResponse,
} = require('../helpers/responseHandler');

const Brand = require('../models/brandModel');

const createBrand = async (req, res) => {
    try {
        const {
            name,
            description,
            logo,
            website,
            discountType,
            discountValue,
        } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Brand name is required',
            });
        }

        // Check if the brand already exists
        const existingBrand = await Brand.findOne({ name });
        if (existingBrand) {
            throw createHttpError(400, 'Brand already exists.');
        }

        // Create the brand
        const brand = await Brand.create({
            name,
            description,
            logo,
            website,
            discountType,
            discountValue,
        });

        return successResponse(res, {
            statusCode: 201,
            message: 'Brand created successfully',
            data: {
                brand,
            },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            success: false,
            message: error.message || 'Internal server error',
        });
    }
};

// get all brands
const getAllBrands = async (req, res) => {
    try {
        // Fetch all brands
        const brands = await Brand.find();

        return successResponse(res, {
            statusCode: 200,
            message: 'Brands fetched successfully',
            data: {
                brands,
            },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// get single brand by id
const getBrandById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the brand by ID
        const brand = await Brand.findById(id);

        if (!brand) {
            throw createHttpError(404, 'Brand not found');
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'Brand fetched successfully',
            data: { brand },
        });
    } catch (error) {
        console.error('Error in getBrandById:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// update brand
const updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            description,
            logo,
            website,
            discountType,
            discountValue,
        } = req.body;

        // Create an update object with only the provided fields
        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (description !== undefined) updateFields.description = description;
        if (logo !== undefined) updateFields.logo = logo;
        if (website !== undefined) updateFields.website = website;
        if (discountType !== undefined)
            updateFields.discountType = discountType;
        if (discountValue !== undefined)
            updateFields.discountValue = discountValue;

        // Find and update the brand
        const brand = await Brand.findByIdAndUpdate(
            id,
            { $set: updateFields }, // Use $set to update only the provided fields
            { new: true, runValidators: true }, // Return the updated brand and run validators
        );

        if (!brand) {
            throw createHttpError(404, 'Brand not found');
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'Brand updated successfully',
            data: { brand },
        });
    } catch (error) {
        console.error('Error in updateBrand:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

// delete brand
const deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;

        // Find and delete the brand
        const brand = await Brand.findByIdAndDelete(id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: 'Brand not found',
            });
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'Brand deleted successfully',
        });
    } catch (error) {
        console.error('Error in deleteBrand:', error);
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal server error',
        });
    }
};

module.exports = {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
};
