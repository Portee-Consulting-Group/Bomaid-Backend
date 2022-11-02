const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const surveySchema = new Schema({
    title: { type: String, required: true },
    questions: [{ type: String, required: true }],
    userId: { type: String, required: true },
    category: [{type: Number}],
    level: {type: Number, required: true},
    surveyTarget: [{type: Number}],
    status: { type: Number, required: true, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Survey = mongoose.model('Surveys', surveySchema);

insert = (data) => {
    const survey = new Survey(data);
    survey.save();
    return survey;
};

findSurvey = async (query) => {
    const value = await Survey.findOne(query);
    if (value == null) {
        return null;
    }
    return value;
};

getAllSurveys = async (query, page, pageSize) => {
    return Survey.find(query)
        .sort({ _id: -1 })
        .skip(page)
        .limit(pageSize);
};

update = async (query, data) => {
    return Survey.findOneAndUpdate(query, data, { new: true });
};



module.exports = {
    insert,
    findSurvey,
    update,
    getAllSurveys
};