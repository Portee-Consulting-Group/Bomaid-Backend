const { NullReferenceException, AlreadyExistsException, CustomException } = require('../../errors/AppError');
const { status } = require('../common/status');
const UserModel = require('../models/EntityModels/userModel');
const SurveyModel = require('../models/EntityModels/surveyModel');
const CategoryModel = require('../models/EntityModels/categoryModel');
const TargetModel = require('../models/EntityModels/targetModel');
const OrgLevelModel = require('../models/EntityModels/organizationalLevelModel');
const SurveyResponseModel = require('../models/EntityModels/surveyResponseModel');
const SuccessResponse = require('../models/viewModels/responseModel');

addSurvey = async (req, res) => {
    try {
        if (req.body.questions.length < 1) {
            throw new CustomException("questions must be greater than 0");
        }
        let user = await UserModel.find({ _id: req.body.userId });
        if (user == null) throw new NullReferenceException("User not found");


        let level = await OrgLevelModel.findLevel({ type: req.body.level });
        if (level == null) throw new NullReferenceException("Level not found");


        let categories = await CategoryModel.getAllCategories();
        let categoryType = []
        if (req.body.category.length > 0) {
            categories.forEach(cat => {
                categoryType.push(cat.type)
            });
            const categoriesExist = req.body.category.every(value => {
                return categoryType.includes(value);
            });
            if (categoriesExist === false) throw new CustomException("please pass only available categories")
        } else {
            req.body.category = []
        }

        let target = await TargetModel.getAllTargets();
        let targetType = []
        if (req.body.surveyTarget.length > 0) {
            target.forEach(targ => {
                targetType.push(targ.type)
            });
            const targetsExist = req.body.surveyTarget.every(value => {
                return targetType.includes(value);
            });
            if (targetsExist === false) throw new CustomException("please pass only available survey target")
        } else {
            req.body.surveyTarget = []
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

getSurveysByCategory = async (req, res) => {
    try {
        const surveys = await SurveyModel.getAllSurveys({category: Number.parseInt(req.params.type) }, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(surveys, "all surveys")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};
getSurveysByLevel = async (req, res) => {
    try {
        const surveys = await SurveyModel.getAllSurveys({level: Number.parseInt(req.params.level) }, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(surveys, "all surveys")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};
getSurveysByTarget = async (req, res) => {
    try {
        const surveys = await SurveyModel.getAllSurveys({surveyTarget: Number.parseInt(req.params.target) }, req.params.page, req.params.pageSize);
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

module.exports = {
    addSurvey,
    getUserSurveys,
    getSurveys,
    addResponse,
    getUserResponses,
    getAllResponses,
    getSurveysByCategory,
    getSurveysByLevel,
    getSurveysByTarget
};