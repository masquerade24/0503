const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const util = require('../middleware/util');
const models = require('../models/');

function signUp(req, res) {
    models.User
        .findOne({ where: { email: req.body.email } })
        .then(result => {
            if (result) {
                res.status(409).json({
                    message: "Email already exists!",
                });
            } else {
                bcryptjs.genSalt(10, function (err, salt) {
                    bcryptjs.hash(req.body.password, salt, function (err, hash) {
                        const user = {
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                        }

                        models.User.create(user)
                            .then(result => {
                                res.status(201).json({
                                    message: 'User created successfully',
                                })
                            })
                            .catch(error => { // user 생성 실패!
                                res.status(500).json({
                                    message: 'Something went wrong!',
                                })
                            });
                    })
                })
            }
        })
        .catch(error => { // user 생성 실패
            res.status(500).json({
                message: 'Something went wrong!',
            })
        });
}

function login(req, res) {
    console.log('로그인 호출');
    models.User
        .findOne({ where: { email: req.body.email } })
        .then(user => {
            if (user === null) {
                res.status(409).json({
                    message: 'Invalid credentials!'
                });
            } else {
                bcryptjs.compare(req.body.password, user.password, async function (err, result) {
                    if (result) { // true면 일치한다는 뜻
                        const tokens = {
                            accessToken: await util.generateAccessToken(req, res),
                            refreshToken: await util.generateRefreshToken(req, res),
                            name: user.dataValues.name
                        }
                        res.cookie('accessToken', tokens.accessToken, {
                            expires: new Date(Date.now() + tokens.accessToken.expiresIn),
                            secure: true,
                            httpOnly: true
                        });
                        res.cookie('refreshToken', tokens.refreshToken, {
                            expires: new Date(Date.now() + tokens.refreshToken.expiresIn),
                            secure: false,
                            httpOnly: true
                        });
                        res.status(200).json({
                            message: '로그인 성공! 토큰이 발급되었습니다',
                            token: tokens,
                        })
                    } else {
                        console.log('에러가 났다!');
                        res.status(409).json({
                            message: 'Invalid credentials!',
                        });
                    }
                });
            }
        })
        .catch(error => {
            console.log('에러가 났다!');
            res.status(500).json({
                message: 'Something went wrong!'
            });
        });
}


function logout(req, res) {
    console.log('사용자 로그아웃 호출됨.');

    if(req.decoded){
        //로그인 된 상태
        console.log('토큰 인증 성공');
        jwt.destroy()
        req.session.destroy(function(err){
            if(err) {throw err;}

            console.log('로그아웃되었습니다.');
            res.status(200);
            res.json({ success: true, message: '계정이 로그아웃 되었습니다.' });
        });
    }
    else {
        //로그인 안된 상태
        console.log('아직 로그인되어 있지 않습니다.');
        res.status(401); //401은 로그인을 하지 않아 페이지를 열 권한이 없는 겁니다.
        res.json({ success: false, message: '아직 로그인하지 않았습니다.' });
    }
}
function kakaoLogin(req, res, next) {
    passport.authenticate('kakao')(req, res, next);
}

function kakaoCallback(req, res, next) {
    passport.authenticate('kakao', {
        failureRedirect: '/',
    })(req, res, next);
}

function kakaoCallback2(req, res) {
    res.status(201).json({
        message: '카카오 로그인 성공'
    })
}
module.exports = {
    signUp,
    login,
    logout,
    kakaoLogin,
    kakaoCallback,
    kakaoCallback2,
};