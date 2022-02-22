const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const otpSchema = new Schema({
    code: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: Number, required: true, default: statusEnum.active.value },
    type: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now},
    updatedAt: { type: Date, default: Date.now}
});

const OtpCode = mongoose.model('Otp', otpSchema);

insert = (otpData) => {
    const otp = new OtpCode(otpData);
    otp.save();
    return otp;
};

findCode = async (query) => {
    const otpValue = await OtpCode.findOne(query);
    if (otpValue == null) {
        return null;
    }
    return otpValue;
};

getAllCodes = async (query) => {
    const otps = await OtpCode.find(query);
    return otps;
}

update = async (query, otpData) => {
    return OtpCode.findOneAndUpdate(query, otpData, { new: true });
};

module.exports = {
    insert,
    findCode,
    update,
    getAllCodes
}