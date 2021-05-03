const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/sign-up', userController.signUp);
router.post('/login', userController.login);
router.get('/logout', userController.logout);
router.get('/kakao', userController.kakaoLogin);
router.get('/kakao/callback', userController.kakaoCallback, userController.kakaoCallback2);

module.exports = router;