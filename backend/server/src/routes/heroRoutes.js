const express = require('express');

const heroRoutes = express.Router();
const {
    getHeroes,
    getHeroById,
    createHero,
    updateHero,
    deleteHero,
} = require('../controllers/heroController');

const { authenticateUser, authorizeAdmin } = require('../middlewares/auth');
const { singleImageUpload } = require('../middlewares/multer');

// const heroController = require('../controllers/heroController');

heroRoutes.post(
    '/',
    authenticateUser,
    authorizeAdmin,
    singleImageUpload('ecommerce/heroes', 'image', {
        transformation: { width: 150, height: 150, crop: 'thumb' }, // Custom transformation
        limits: { fileSize: 2 * 1024 * 1024 }, // 2MB file size limit
    }),
    createHero,
);
heroRoutes.get('/', getHeroes);
heroRoutes.get('/:id', getHeroById);
heroRoutes.put('/:id', updateHero);
heroRoutes.delete('/:id', deleteHero);

module.exports = heroRoutes;
