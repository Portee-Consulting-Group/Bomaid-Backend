const emailService = require('../services/EmailService');
const otpService = require('../services/OtpService');
const OtpModel = require("../models/EntityModels/otpModel");
const UserModel = require("../models/EntityModels/userModel");
const { NullReferenceException, NotFoundException, CustomException } = require('../../errors/AppError');
const { status } = require('../common/status');
const SuccessResponse = require('../models/viewModels/responseModel');
const statusEnum = require('../common/enum').getStatusEnum();
const otpEnums = require('../common/enum').getOtpEnum();
const UserController = require('./userController');


sendRegistrationOtpCode = async (req, res) => {
    try {
        var user = await UserModel.find({ email: req.params.email });
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        const otpViewModel = {
            email: user.email, //change to phone no
            name: `${user.firstName} ${user.lastName}`
        };
        let response = await otpService.signUpOtp(otpViewModel);
        if (response == null) {
            throw new NullReferenceException();
        } else {
            let response = new SuccessResponse(null, "Otp send to phone no will expire in 10 minutes");
            res.status(status.SUCCESS).json(response);
        }
    } catch (err) {
        res.status(status.ERROR).json({ message: err.message });
    }
}

verifyEmailConfirmationOtp = async (req, res) => {
    try {
        let user = await UserModel.find({ email: req.body.email });
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        req.body.email = user.email;
        req.body.type = otpEnums.registration.value;
        let otpStatus = await verifyOtpCode(req);
        if (otpStatus) {
            let userQuery = { email: user.email };
            let userData = { status: statusEnum.active.value }

            let userResponse = await UserModel.update(userQuery, userData);
            if (userResponse == null) {
                throw new NullReferenceException("user update failed after otp");
            }
            const otpViewModel = {
                email: user.email,
                name: `${user.firstName} ${user.lastName}`
            };
            emailService.SendOtpConfirmationEmail(otpViewModel);
            res.status(status.SUCCESS).json({ "success": "Otp code confirmed" });
        } else {
            throw new CustomException("Confirmation failed");
        }
    } catch (error) {
        res.status(status.ERROR).json({ message: error.message });
    }
};

verifyPhoneConfirmationOtp = async (req, res) => {
    try {
        let user = await UserModel.find({ phoneNo: req.body.phoneNo, callingCodeId: req.body.callingCodeId });
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        req.body.email = user.email;
        req.body.type = otpEnums.registration.value;
        let otpStatus = await verifyOtpCode(req);
        if (otpStatus) {
            let userQuery = { email: user.email };
            let userData = { status: statusEnum.active.value }

            let userResponse = await UserModel.update(userQuery, userData);
            if (userResponse == null) {
                throw new NullReferenceException("user update failed after otp");
            }
            const otpViewModel = {
                email: user.email,
                name: `${user.firstName} ${user.lastName}`
            };
            emailService.SendOtpConfirmationEmail(otpViewModel);
            res.status(status.SUCCESS).json({ "success": "Otp code confirmed" });
        } else {
            throw new CustomException("Confirmation failed");
        }
    } catch (error) {
        res.status(status.ERROR).json({ message: error.message });
    }
};

verifyPasswordResetOtp = async (req, res) => {
    try {
        var user = await UserModel.find({ email: req.body.email });
        if (user == null) {
            throw new NotFoundException("User not found");
        }

        if (req.body.password !== req.body.confirmPassword) {
            throw new CustomException("Both passwords must match");
        }
        req.body.type = otpEnums.resetPassword.value;

        let otpStatus = await verifyOtpCode(req);
        if (otpStatus) {
            let { salt, hash } = await UserController.hasher(req);
            req.body.password = salt + "$" + hash;
            await UserModel.update({ password: req.body.password });
            //send email or sms
            let response = new SuccessResponse(null, "Password reset successfully");
            res.status(status.SUCCESS).json({ message: response });
        } else {
            throw new CustomException("Confirmation failed");
        }
    } catch (error) {
        res.status(status.ERROR).json({ message: error.message });
    }
};

verifyOtpCode = async (req, res) => {
    try {
        let user = await UserModel.find({ email: req.body.email })
        if (user == null) {
            throw new NotFoundException("User not found");
        } else {
            let result = await otpService.checkOtp(req.body);
            if (result == null || result.status == statusEnum.inactive.value) {
                throw new CustomException("Otp has expired");
            } else {
                let otpQuery = {
                    email: req.body.email,
                    code: req.body.code,
                    type: req.body.type
                };

                let otpResponse = await OtpModel.update(otpQuery, {
                    status: statusEnum.inactive.value
                })

                if (otpResponse == null) {
                    return false;
                }
                return true;
            }
        }
    } catch (err) {
        throw err;
    }
}


sendPasswordResetCode = async (req, res) => {
    try {
        let user = await UserModel.find({ email: req.params.email });
        if (user == null) {
            throw new NotFoundException();
        }

        const otpViewModel = {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`
        };
        otpService.passwordResetOtp(otpViewModel);
        res.status(status.SUCCESS).json({ status: "Otp sent" });
    } catch (err) {
        res.status(status.ERROR).json({ message: err.message });
    }
};

module.exports = {
    sendRegistrationOtpCode,
    verifyPhoneConfirmationOtp,
    verifyEmailConfirmationOtp,
    verifyPasswordResetOtp,
    sendPasswordResetCode
};