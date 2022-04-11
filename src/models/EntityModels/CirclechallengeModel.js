const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const circleChallengeSchema = new Schema({
    results: { type: Array }, //{userId: "oeuoueo", value: 12}
    challengeId: { type: String, required: true },
    goalTypeId: { type: String, required: true },
    circleId: { type: String, required: true },
    // endTime: { type: String },
    // endDate: { type: Date },
    status: { type: Number, required: true, default: statusEnum.active.value },
    aggregatedResult: {type: Number, default: 0},
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

findAll = async (query) => {
    const value = await CircleChallenge.find(query);
    if (value == null) {
        return [];
    }
    return value;
}

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
    findAll,
    update,
    getResults
};