var jwt = require('jsonwebtoken');
var models = require("../models");

var util = {};

util.checkAuth = async function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1]; // 여기서 token만 가져온다.
        const decodedToken = jwt.verify(token, process.env.ACT_SECRET)
        req.userData = decodedToken;
        const user = await models.User.findOne({ where: { email: req.userData.email } });
        req.body.id = user.id;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(419).json({
                code: 419,
                message: '토큰이 만료되었습니다',
            })
        }
        return res.status(401).json({
            message: '유효하지 않은 토큰입니다.',
            error,
        });
    };
};

util.generateAccessToken = function (req, res) {
    return new Promise((resolve, reject) => {
        jwt.sign({
            email: req.body.email,
            name: req.body.name,
        }, process.env.ACT_SECRET, {
            algorithm: 'HS256',
            // expiresIn: process.env.ACT_LIFE
        }, (err, token) => {
            if (err) {
                console.log('hello');
                return res.json(util.successFalse(err));
            }
            else resolve(token);
        });
    });
}

util.generateRefreshToken = function (req, res) {
    return new Promise((resolve, reject) => {
        jwt.sign({
            email: req.body.email,
            name: req.body.name
        }, process.env.RFS_SECRET, {
            algorithm: 'HS256',
            // expiresIn: process.env.RFS_LIFE
        }, (err, token) => {
            if (err)
                return res.json(util.successFalse(err));
            else resolve(token);
        });
    });
}

util.isLoggedin = function (req, res, next) {
    var token = req.headers['x-access-token'] || req.query.token;
    //token 변수에 토큰이 없다면
    console.log("token: ", token);
    if (!token) return res.json(util.successFalse(null, '로그인이 필요합니다.'));
    //토큰이 있다면
    else {
        jwt.verify(token, process.env.ACT_SECRET, function (err, decoded) {
            if (err) return res.status(401).json(util.successFalse(err));
            else {
                console.dir(decoded);
                console.log('JWT 인증됨.')
                req.body.user_id = decoded.user_id;
                next();
            }
        });
    }
};

util.isAdmin = function (req, res, next) {
    var token = req.headers['x-access-token'] || req.query.token;
    //token 변수에 토큰이 없다면
    if (!token) return res.json(util.successFalse(null, '관리자 권한이 필요합니다'));
    //토큰이 있다면
    else {
        jwt.verify(token, process.env.ACT_SECRET, function (err, decoded) {
            if (err) return res.status(401).json(util.successFalse(err));
            else {
                if (decoded.admin) {
                    console.dir(decoded);
                    req.body.user_id = decoded.user_id;
                    next();
                }
                else {
                    res.status(401).json(util.successFalse(null, '권한이 없습니다.')); // 권한 없음
                }
            }
        });
    }
};

//토큰에 들어있는 ID와 DB에서 찾은 ID와 비교
util.checkPermission = (req, res, next) => {
    models.user
        .findOne({
            where: { user_id: req.params.userid }
        }).then((data) => {
            console.dir(req.decoded);
            if (data.dataValues.user_id === req.body.user_id)
                next();

            else res.status(401).json(util.successFalse(null, "you don't have permission"));
        }).catch((err) => {
            res.status(401).json(util.successFalse(err));
        })
};
util.successTrue = function (data) {
    return {
        success: true,
        timestamp: new Date(Date.now()),
        data: data
    };
};

util.successTrueDetail = function (spec, review, news, youtube) {
    return {
        success: true,
        timestamp: new Date(Date.now()),
        spec: spec,
        review: review,
        news: news,
        youtube: youtube
    };
};

util.successFalse = function (err, comment) {
    if (!err && !comment) comment = 'data not found';

    return {
        success: false,
        timestamp: new Date(Date.now()),
        data: (err) ? util.parseError(err) : null,
        comment: (comment) ? comment : null
    };
};

util.parseError = function (err) {
    var parsed = {
        name: err.name,
        msg: err.message
    };
    if (err.name == 'ValidationError') {
        return err;
    }
    else {
        return parsed;
    }
};


exports.result = (req, res, next) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
        res.status(422);
        console.dir(err);
        err.errors.name = err.name
        res.json(util.successFalse({
            name: 'ValidationError',
            errors: err.errors //에러가 ID에서만 나면 [0], password까지 나면 [1]까지 배열 출력
        })
        );
    }
    else next();
}


module.exports = util;