const UserModel = require('../models/EntityModels/userModel');
const crypto = require('crypto');
const { status } = require('../common/status');
const { NotFoundException, CustomException } = require('../../errors/AppError');


exports.hasAuthValidFields = (req, res, next) => {
    try {
        let errors = [];
        if (req.body) {
            if (!req.body.email) {
                errors.push('Missing username field');
            }
            if (!req.body.password) {
                errors.push('Missing password field');
            }

            if (errors.length) {
                throw new CustomException(errors.join(','));
            } else {
                return next();
            }
        } else {
            throw new CustomException("Missing username, password fields");
        }
    } catch (error) {
        res.status(status.ERROR).json({message:  error.message });
    }
};



exports.isPasswordAndUserMatch = async (req, res, next) => {
    try {
        const user = await UserModel.find({ email: req.body.email });
        console.log(user);
        if (user == null) {
            throw new NotFoundException("User does not exist");
        } else {
            let passwordFields = user.password.split('$');
            let salt = passwordFields[0];
            let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
            if (hash === passwordFields[1]) {
                req.user = user;
                return next();
            } else {
                throw new CustomException("Invalid username or password");
            }
        }
    } catch (error) {
        res.status(status.ERROR).json({message:  error.message });
    }
};

