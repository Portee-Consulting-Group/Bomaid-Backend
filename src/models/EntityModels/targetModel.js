const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const targetSchema = new Schema({
    name: { type: String, required: true },
    type: { type: Number, required: true, unique: true },
    status: { type: Number, required: true, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const SurveyTarget = mongoose.model('SurveyTarget', targetSchema);

insert = (data) => {
    const level = new SurveyTarget(data);
    level.save();
    return level;
};

insertMany = async (data) => {
    let allTargets = await getAllTargets();
    if (allTargets.length == 0) {
        const response = await SurveyTarget.insertMany(data);
    }
}

findLevel = async (query) => {
    const value = await SurveyTarget.findOne(query);
    if (value == null) {
        return null;
    }
    return value;
};

getAllTargets = async (query) => {
    const levels = await SurveyTarget.find(query);
    return levels;
}


update = async (query, data) => {
    return SurveyTarget.findOneAndUpdate(query, data, { new: true });
};

module.exports = {
    insert,
    insertMany,
    findLevel,
    update,
    getAllTargets
}