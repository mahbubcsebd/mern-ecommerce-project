const createHttpError = require('http-errors');
const Hero = require('../models/heroModel');
const {
    successResponse,
    errorResponse,
} = require('../helpers/responseHandler');

// ✅ Create a new hero
const createHero = async (req, res, next) => {
    try {
        const { title, subtitle, link, isActive } = req.body;
        const image = req.file ? req.file.path : null; // Image path ta req.file theke niye asha

        if (!title || !image) {
            return next(createHttpError(400, 'Title and Image are required'));
        }

        const newHero = new Hero({ title, subtitle, image, link, isActive });
        await newHero.save();

        return successResponse(res, {
            statusCode: 201,
            message: 'Hero created successfully',
            data: { newHero },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

// ✅ Get all heroes
const getHeroes = async (req, res) => {
    try {
        const heroes = await Hero.find();
        return successResponse(res, {
            statusCode: 200,
            message: 'Heroes fetched successfully',
            data: { heroes },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

// ✅ Get a single hero by ID
const getHeroById = async (req, res, next) => {
    try {
        const hero = await Hero.findById(req.params.id);
        if (!hero) {
            return next(createHttpError(404, 'Hero not found'));
        }
        return successResponse(res, {
            statusCode: 200,
            message: 'Hero fetched successfully',
            data: { hero },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

// ✅ Update a hero
const updateHero = async (req, res, next) => {
    try {
        const { title, subtitle, link, isActive } = req.body;
        const image = req.file ? req.file.path : undefined; // Jodi image thake, tahole nibo

        const hero = await Hero.findById(req.params.id);
        if (!hero) {
            return next(createHttpError(404, 'Hero not found'));
        }

        // Allowed fields update
        hero.title = title || hero.title;
        hero.subtitle = subtitle || hero.subtitle;
        hero.link = link || hero.link;
        hero.isActive = isActive !== undefined ? isActive : hero.isActive;
        if (image) hero.image = image; // Image thakle update korbo

        await hero.save();

        return successResponse(res, {
            statusCode: 200,
            message: 'Hero updated successfully',
            data: { hero },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

// ✅ Delete a hero
const deleteHero = async (req, res, next) => {
    try {
        const hero = await Hero.findByIdAndDelete(req.params.id);
        if (!hero) {
            return next(createHttpError(404, 'Hero not found'));
        }

        return successResponse(res, {
            statusCode: 200,
            message: 'Hero deleted successfully',
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status || 500,
            message: error.message || 'Internal Server Error',
        });
    }
};

module.exports = {
    getHeroes,
    getHeroById,
    createHero,
    updateHero,
    deleteHero,
};
