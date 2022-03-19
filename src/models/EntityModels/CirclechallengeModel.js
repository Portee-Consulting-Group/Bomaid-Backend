const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const circleChallengeSchema = new Schema({
    results: { type: Array },
    challengeId: { type: String, required: true },
    circleId: { type: String, required: true },
    endTime: { type: Number },
    endDate: { type: Date },
    status: { type: Number, required: true, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const CircleChallenge = mongoose.model('CircleChallenges', circleChallengeSchema);

insert = (data) => {
    const circleChallenge = new CircleChallenge(data);
    circleChallenge.save();
    return circleChallenge;
};

findCircleChallenge = async (query) => {
    const value = await CircleChallenge.findOne(query);
    if (value == null) {
        return null;
    }
    return value;
};

getResults = async (query, page, pageSize) => {
    return CircleChallenge.find(query)
        .sort({ _id: -1 })
        .skip(page)
        .limit(pageSize);
};

update = async (query, data) => {
    return CircleChallenge.findOneAndUpdate(query, data, { new: true });
};

module.exports = {
    insert,
    findCircleChallenge,
    update,
    getResults
};