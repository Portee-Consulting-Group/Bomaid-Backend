const { NullReferenceException, AlreadyExistsException, NotFoundException, CustomException } = require('../../errors/AppError');
const UserModel = require('../models/EntityModels/userModel');
const OrgLevelModel = require('../models/EntityModels/organizationalLevelModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const { status } = require('../common/status');
const { getGenderEnums, getAccountTypeEnums } = require('../common/enum');
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

        if (req.body.orgLevel != undefined && req.body.orgLevel !== '') {
            let levels = await OrgLevelModel.getAllLevels();
            let levelExist = levels.some(level => {
                if (level.type == req.body.orgLevel) {
                    return true;
                } else {
                    return false;
                }
            });
            if (levelExist != true) throw new NotFoundException("That organization level does not exist");
        } else {
            throw new NotFoundException("Please pass organization level");
        }

        const genders = getGenderEnums();
        if (genders.get(Number(req.body.genderType)) == undefined) {
            throw new NotFoundException("gender not found");
        }

        const accountType = getAccountTypeEnums();
        if (accountType.get(Number(req.body.accountType)) == undefined) {
            throw new NotFoundException("type not found");
        }


        if (req.body.profileImage != undefined && req.body.profileImage !== '') {
            const uploadedImage = await clodinaryService.uploadProfileImage(req.body.profileImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
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
getUserById = async (req, res) => {
    try {
        let user = await UserModel.find({ _id: req.params.userId });
        if (user == null) {
            throw new NotFoundException("User not found");
        }
        user.password = undefined;
        user.token = undefined;
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
        if (req.body.profileImage != undefined && req.body.profileImage !== '') {
            const uploadedImage = await clodinaryService.uploadProfileImage(req.body.profileImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        }

        if (req.body.orgLevel != undefined && req.body.orgLevel !== '') {
            let levels = await OrgLevelModel.getAllLevels();
            let levelExist = levels.some(level => {
                if (level.type == req.body.orgLevel) {
                    return true;
                } else {
                    return false;
                }
            });
            if (levelExist != true) throw new NotFoundException("That organization level does not exist");
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
        let users = await UserModel.getActiveUsers({}, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(users, "All Users");
        res.status(status.SUCCESS).json({ messge: response });
    } catch (error) {
        res.status(status.ERROR).json({ message: error.message });
    }
};

getUsersByOrgLevel = async (req, res) => {
    try {
        let users = await UserModel.getActiveUsers({ orgLevel: req.params.level }, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(users, "All Users");
        res.status(status.SUCCESS).json({ messge: response });
    } catch (error) {
        res.status(status.ERROR).json({ message: error.message });
    }
};

deleteAccount = async (req, res) => {
    try {
        let user = await UserModel.find({ _id: req.params.userId });
        if (user == null) throw new NotFoundException("User not found");
        await UserModel.deleteAccount(req.params.userId);
        res.status(status.SUCCESS).json({ messge: "Account deleted" })
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
    hasher,
    getUserById,
    getUsersByOrgLevel,
    deleteAccount
}

