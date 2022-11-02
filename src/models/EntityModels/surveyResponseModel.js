const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const surveyResponseSchema = new Schema({
    answers: [{ type: String, required: true }],
    surveyId: { type: String, required: true },
    userId: { type: String, required: true },
    status: { type: Number, required: true, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const SurveyResponse = mongoose.model('SurveyResponses', surveyResponseSchema);

insert = (data) => {
    const response = new SurveyResponse(data);
    response.save();
    return response;
};

findResponse = async (query) => {
    const value = await SurveyResponse.findOne(query);
    if (value == null) {
        return null;
    }
    return value;
};

getAllResponses = async (query, page, pageSize) => {
    return SurveyResponse.find(query)
        .sort({ _id: -1 })
        .skip(page)
        .limit(pageSize);
};

update = async (query, data) => {
    return SurveyResponse.findOneAndUpdate(query, data, { new: true });
};



module.exports = {
    insert,
    findResponse,
    update,
    getAllResponses
};