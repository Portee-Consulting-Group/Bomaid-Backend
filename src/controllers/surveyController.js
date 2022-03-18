const { NullReferenceException, AlreadyExistsException, CustomException } = require('../../errors/AppError');
const { status } = require('../common/status');
const UserModel = require('../models/EntityModels/userModel');
const SurveyModel = require('../models/EntityModels/surveyModel');
const SurveyResponseModel = require('../models/EntityModels/surveyResponseModel');
const SuccessResponse = require('../models/viewModels/responseModel');

addSurvey = async (req, res) => {
    try {
        if (req.body.questions.length < 1) {
            throw new CustomException("questions must be greater than 0");
        }
        let user = await UserModel.find({ _id: req.body.userId });
        if (user == null) {
            throw new NullReferenceException("User not found");
        }
        let survey = await SurveyModel.insert(req.body);
        let response = new SuccessResponse(survey, "survey added");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

getUserSurveys = async (req, res) => {
    try {
        const surveys = await SurveyModel.getAllSurveys({ userId: req.params.userId }, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(surveys, "user surveys")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

getSurveys = async (req, res) => {
    try {
        const surveys = await SurveyModel.getAllSurveys({}, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(surveys, "all surveys")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

addResponse = async (req, res) => {
    try {
        if (req.body.answers.length < 1) {
            throw new CustomException("answers must be greater than 0");
        }
        let survey = await SurveyModel.findSurvey({ _id: req.body.surveyId });
        if (survey == null) {
            throw new NullReferenceException("Survey not found");
        }

        let user = await UserModel.find({ _id: req.body.userId });
        if (user == null) {
            throw new NullReferenceException("User not found");
        }

        let surveyRes = await SurveyResponseModel.insert(req.body);
        let response = new SuccessResponse(surveyRes, "response added");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};


getUserResponses = async (req, res) => {
    try {
        const userRes = await SurveyResponseModel.getAllResponses({ userId: req.params.userId }, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(userRes, "all user responses")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

getAllResponses = async (req, res) => {
    try {
        const userRes = await SurveyResponseModel.getAllResponses({}, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(userRes, "all responses")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};
module.exports = {
    addSurvey,
    getUserSurveys,
    getSurveys,
    addResponse,
    getUserResponses,
    getAllResponses
};