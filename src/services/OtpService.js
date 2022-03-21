const { CustomException, NullReferenceException } = require('../../errors/AppError');
const OtpModel = require('../models/EntityModels/otpModel');
const emailService = require('../services/EmailService');
const otpEnums = require('../common/enum').getOtpEnum();
const statusEnums = require('../common/enum').getStatusEnum();


signUpOtp = async (model) => {
    let otpCode = await generateOtp();

    const otpData = {
        email: model.email,
        code: otpCode,
        type: otpEnums.registration.value
    };

    const otpValue = await OtpModel.insert(otpData);
    if (otpValue == null) {
        throw new NullReferenceException("otp not created");
    }
    await emailService.SendOtpConfirmationEmail({email: model.email, otpCode: otpValue.code})
    return otpValue;
}

checkOtp = async (otpViewModel) => {
    try {
        let response = await OtpModel.findCode(otpViewModel);
        if (response == null) {
            throw new NullReferenceException("Otp not found");
        } else {
            return response;
        }
    } catch (err) {
        console.log("Otp is throwing here ", err);
        throw new CustomException("Error with service");
    }
}

passwordResetOtp = async (otpViewModel) => {
    let otpCode = generateOtp();
    const otpData = {
        email: otpViewModel.email,
        code: otpCode,
        type: otpEnums.resetPassword.value
    };

    const otpValue = await OtpModel.insert(otpData);
    if (otpValue == null) {
        new Error("otp not created");
    }
    otpViewModel.email = otpViewModel.email;
    otpViewModel.otpCode = otpCode;
    otpViewModel.name = otpViewModel.name;
    emailService.SendOtpPasswordResetEmail(otpViewModel);
    return otpValue;
};

invalidateOtp = async () => {
    let otps = await OtpModel.getAllCodes({ status: statusEnums.active.value });
    if (otps.length > 0) {
        for (const element of otps) {
            await OtpModel.update({ _id: element.id }, { status: statusEnums.inactive.value });
        }
    }
};

generateOtp = () => {
    let value = Math.floor(100000 + Math.random() * 900000);
    let otpExists = OtpModel.findCode({ code: value });
    if (otpExists == null) {
        generateOtp();
    }
    return value;
};

module.exports = {
    signUpOtp,
    checkOtp,
    passwordResetOtp,
    invalidateOtp
}