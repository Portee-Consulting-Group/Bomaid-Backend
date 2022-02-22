const jwt = require('jsonwebtoken');
const secret = process.env.SESSION_SECRET;
const crypto = require('crypto');
const { status } = require('../common/status');
const UserModel = require('../models/EntityModels/userModel');
const { NotFoundException } = require('../../errors/AppError');

exports.verifyRefreshBodyField = (req, res, next) => {
    if (req.body && req.body.refresh_token) {
        return next();
    } else {
        return res.status(status.ERROR).json({error: 'need to pass refresh_token field'});
    }
};

exports.validRefreshNeeded = (req, res, next) => {
    let b = Buffer.from(req.body.refresh_token, 'base64');
    let refresh_token = b.toString();
    let hash = crypto.createHmac('sha512', req.jwt.refreshKey).update(req.jwt.userId + secret).digest("base64");
    if (hash === refresh_token) {
        req.body = req.jwt;
        return next();
    } else {
        return res.status(status.ERROR).json({error: 'Invalid refresh token'});
    }
};


exports.validJWTNeeded = async  (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');
            if (authorization[0] !== 'Bearer') {
                return res.status(status.ERROR).send();
            } else {
                let value = jwt.verify(authorization[1], secret);
                let user = await UserModel.find({email: value.email});
                if(user == null){
                    throw new NotFoundException("User not found");
                }
                req.jwt = user;
                return next();
            }

        } catch (err) {
            return res.status(status.ERROR).send({message: err.message});
        }
    } else {
        return res.status(status.ERROR).send({message: "Bearer token required"});
    }
};