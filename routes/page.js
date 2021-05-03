const express = require('express');
const pageController = require('../controllers/pageController');

const router = express.Router();

router.post('/', pageController.test);

module.exports = router;