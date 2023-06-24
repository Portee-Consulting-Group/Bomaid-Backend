const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const challengeSchema = new Schema({
    title: { type: String, lowercase: true},
    description: { type: String },
    info: { type: String },
    goalTypeId: { type: String, required: true },
    challengeTarget: { type: Number, required: true },
    uploadUrl: { type: String, default: "" },
    uploadId: { type: String, default: "" },
    startDate: {type:String, default: "" },
    endDate: {type:String, default: "" },
    status: { type: Number, required: true, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Challenge = mongoose.model('Challenges', challengeSchema);

insert = (data) => {
    const challenge = new Challenge(data);
    challenge.save();
    return challenge;
};

findChallenge = async (query) => {
    const value = await Challenge.findOne(query);
    if (value == null) {
        return null;
    }
    return value;
};

findAll = async (query) => {
    const value = await Challenge.find(query);
    if (value == null) {
        return null;
    }
    return value;
};

getAllChallenges = async (query, page, pageSize) => {
    return Challenge.find(query)
        .sort({ _id: -1 })
        .skip(page)
        .limit(pageSize);
};

update = async (query, data) => {
    return Challenge.findOneAndUpdate(query, data, { new: true });
};



module.exports = {
    insert,
    findChallenge,
    findAll,
    update,
    getAllChallenges
};