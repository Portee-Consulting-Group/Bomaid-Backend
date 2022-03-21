const { NullReferenceException, AlreadyExistsException, NotFoundException, CustomException } = require('../../errors/AppError');
const UserModel = require('../models/EntityModels/userModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const { status } = require('../common/status');
const { getGenderEnums } = require('../common/enum');
const otpService = require('../services/OtpService');
const emailService = require('../services/EmailService');
const crypto = require('crypto');
const AuthController = require('../controllers/authController');
const { constants } = require('../common/constants');
const clodinaryService = require('../services/CloudinaryService');

addUser = async (req, res) => {
    try {
        let val = req.body.email.split("@");
        val = val[1].toLowerCase();
        if (val != constants.EMAIL_CHECK) {
            throw new CustomException("Please use the correct email")
        }
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

        const otpViewModel = {
            email: user.email,
            otpCode: otpData.code,
            name: otp.name
        }
        await emailService.SendRegistrationOtpEmail(otpViewModel);

        //phone no otp


        await emailService.SendSuccessfulSignupEmail(otpViewModel);
        const response = new SuccessResponse(user, 'user created');
        res.status(status.SUCCESS).json({ message: response });
    } catch (err) {
        res.status(status.ERROR).json({ message: err.message });
    }
};

getUser = async (req, res) => {
    try {
        let user = await UserModel.find({ email: req.params.email });
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        user.password = undefined;
        const response = new SuccessResponse(user, 'user details');
        res.status(status.SUCCESS).json({ message: response });
    } catch (error) {
        res.status(status.ERROR).json({ message: error.message });
    }
}


updateUser = async (req, res) => {
    try {
        let user = UserModel.find({ id: req.body.id });
        if (user == null) {
            throw new NullReferenceException("User not found");
        }
        if (req.body.profileImage != undefined) {
            const uploadedImage = await clodinaryService.uploadProfileImage(req.body.profileImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        }

        user = await UserModel.update({ _id: req.body.id }, req.body);

        const response = new SuccessResponse(user, 'updated user details');
        res.status(status.SUCCESS).json({ message: response });
    } catch (error) {
        res.status(status.ERROR).json({ message: error.message });
    }
};

getUsers = async (req, res) => {
    try {
        let kycs = await UserModel.getActiveUsers({}, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(kycs, "All Users");
        res.status(status.SUCCESS).json({ messge: response });
    } catch (error) {
        res.status(status.ERROR).json({ message: error.message });
    }
};


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
    updateUser,
    getUser,
    getUsers,
    testEmail,
    hasher
}

