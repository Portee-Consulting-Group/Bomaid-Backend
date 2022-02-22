const { NullReferenceException, AlreadyExistsException, NotFoundException } = require('../../errors/AppError');
const UserModel = require('../models/EntityModels/userModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const { status } = require('../common/status');
const { getGenderEnums } = require('../common/enum');
const otpService = require('../services/OtpService');
const emailService = require('../services/EmailService');
const otpViewModel = require('../models/viewModels/otpViewModel');
const crypto = require('crypto');
const AuthController = require('../controllers/authController');

addUser = async (req, res) => {
    try {
        if ((req.body.password !== req.body.confirmPassword) || (req.body.email == null)) {
            throw new NullReferenceException("please pass valid passwords");
        }
        const userExist = await UserModel.find({ email: req.body.email, phoneNo: req.body.phoneNo });
        if (userExist != null) {
            throw new AlreadyExistsException("User with that email and phone no already exists");
        }


        const genders = getGenderEnums();
        if (genders.get(Number(req.body.genderType)) == undefined) {
            throw new NotFoundException("gender not found");
        }

        let { salt, hash } = hasher(req);
        req.body.password = salt + "$" + hash;
        const user = await UserModel.add(req.body);
        req.user = user;
        const token = await AuthController.generateJwtToken(user.email);

        await UserModel.update({ _id: user._id }, { token: token });

        user.password = undefined;
        user._id = undefined;
        user.userTypeId = undefined;

        if (user == null) {
            throw new NullReferenceException('User not added');
        }
        const otp = {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`
        }
        const otpData = await otpService.signUpOtp(otp);

        otpViewModel.email = user.email;
        otpViewModel.otpCode = otpData.code;
        otpViewModel.name = otp.name;
        await emailService.SendRegistrationOtpEmail(otpViewModel);

        //phone no otp

        await emailService.SendSuccessfulSignupEmail();
        const response = new SuccessResponse(user, 'user created');
        res.status(status.SUCCESS).json({ message: response });
    } catch (err) {
        res.status(status.ERROR).json({ message: err.message });
    }
};

getUser = async (req, res) => {
    try {
        let user = await UserModel.find({ email: req.body.email });
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        const response = new SuccessResponse(user, 'user details');
        res.status(status.SUCCESS).json({ message: response });
    } catch (error) {
        res.status(status.ERROR).json({ message: error.message });
    }
}


testEmail = async (req, res) => {
    await emailService.Test();
    res.status(200).json({ message: 'yes' });
};

hasher = (req) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    return { salt, hash };
}

module.exports = {
    addUser,
    testEmail,
    hasher
}

