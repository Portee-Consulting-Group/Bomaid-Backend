const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const challengeSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    goalTypeId: { type: String, required: true },
    challengeTarget: { type: Number, required: true },
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
    update,
    getAllChallenges
};