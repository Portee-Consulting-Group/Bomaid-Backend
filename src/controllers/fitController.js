const { NullReferenceException, AlreadyExistsException, CustomException } = require('../../errors/AppError');
const { status } = require('../common/status');
const FitModel = require('../models/EntityModels/fitModel');
const UserModel = require('../models/EntityModels/userModel');
const GoalTypeModel = require('../models/EntityModels/goalTypeModel');
const CirclechallengeModel = require('../models/EntityModels/CirclechallengeModel');
const UserchallengeModel = require('../models/EntityModels/userChallengeModel');
const UserGoalModel = require('../models/EntityModels/userGoalModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');
const { POINT_UNIT } = require('../common/constants');
const statisticEnum = require('../common/enum').getStatisticEnums();

addFit = async (req, res) => {
    try {
        let user = await UserModel.find({ _id: req.body.userId });
        if (user == null) {
            throw new NullReferenceException("User not found");
        }
        let goaltype = await GoalTypeModel.find({ _id: req.body.goalTypeId });
        if (goaltype == null) {
            throw new NullReferenceException("goal type not found");
        }

        const userGoal = await UserGoalModel.find({ goalTypeId: req.body.goalTypeId });
        if (userGoal == null) {
            req.body.statistic = statisticEnum.good.value;
        } else {
            const value = Math.round((req.body.fitValue / goaltype.target) * 100); //convert fit points to percentage to see where user statistic lies
            if (value >= 70 || value >= 100) {
                req.body.statistic = statisticEnum.good.value;
            } else if (value >= 30 && value < 70) {
                req.body.statistic = statisticEnum.average.value;
            } else if (value >= 0 && value < 30) {
                req.body.statistic = statisticEnum.bad.value;
            }
            else {
                throw new CustomException("Pass correct value");
            }
        }
        //if user belongs to challenge add fit result
        let userChallenge = await UserchallengeModel.findUserChallenge({ userId: req.body.userId, challengeId: req.body.challengeId })
        if (userChallenge != null) {
            const newRecord = {
                value: req.body.fitValue,
                dateEntered: Date.now()
            }
            userChallenge.results.push(newRecord)
            console.log(userChallenge.results)
            await UserchallengeModel.update({ userId: req.body.userId }, {
                results: userChallenge.results
            })
        }

        //update all circlechallenge user belongs to
        let circles = await CirclechallengeModel.findAll({ "results.userId": req.body.userId });
        let circleChallenges = []
        for (const iterator of circles) {
            if (iterator.goalTypeId === req.body.goalTypeId) {
                circleChallenges.push(iterator);
            }
        }
        if (circleChallenges !== undefined && circleChallenges.length > 0) {
            for (const circle of circleChallenges) {
                let circleChallengeResult = circle.aggregatedResult;
                if (circle.results.some(e => e.userId === req.body.userId)) {
                    let user = circle.results.find(e => e.userId == req.body.userId);
                    let index = circle.results.findIndex(e => e.userId == req.body.userId);
                    user.value += req.body.fitValue;
                    circle.results[index].value = user.value
                    circleChallengeResult += req.body.fitValue;
                }
                let data = await CirclechallengeModel.update({ _id: circle._id },
                    {
                        results: circle.results,
                        aggregatedResult: circleChallengeResult
                    });
            }

            let fit = await FitModel.insert(req.body);
            let response = new SuccessResponse(fit, "fit added");
            res.status(status.SUCCESS).json(response);
        } else {
            res.status(status.ERROR).json({ error: "Failed to add fit" });
        }
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

updateFit = async (req, res) => {
    try {
        let fit = await FitModel.findFit({ _id: req.body.fitId });
        if (fit == null) {
            throw new NullReferenceException("Fit not found");
        }
        if (req.body.fitImage != undefined) {
            const uploadedImage = await clodinaryService.uploadFitImage(req.body.fitImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        } else {
            throw new NullReferenceException("Image is required");
        }
        fit = await FitModel.update({ _id: req.body.fitId }, req.body);
        let response = new SuccessResponse(fit, "fit updated");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

getFitStatistics = async (req, res) => {
    try {
        let user = await UserModel.find({ _id: req.params.userId });
        if (user == null) {
            throw new NullReferenceException("User not found");
        }

        const statistics = [];
        const goalTypes = await GoalTypeModel.findAll({});

        for (const goalType of goalTypes) {
            const fit = await FitModel.findAll({ userId: req.params.userId, goalTypeId: goalType._id });
            let sum = 0;

            for (const data of fit) {
                sum += data.fitValue;
            }
            let fitStat = {
                goalTypeId: goalType._id,
                statistic: sum,
                points: Math.floor(sum / POINT_UNIT)
            };
            statistics.push(fitStat);
        }
        let response = new SuccessResponse(statistics, "user fit statistics")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}

getFits = async (req, res) => {
    try {
        var fits = await FitModel.getAllFits({ userId: req.params.userId }, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(fits, "user fits")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

getAllFits = async (req, res) => {
    try {
        var fits = await FitModel.getAllFits({}, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(fits, "all fits")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

getAllFitsByGoalType = async (req, res) => {
    try {
        var fits = await FitModel.getAllFits({ goalTypeId: req.params.goalTypeId }, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(fits, "all fits")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

module.exports = {
    addFit,
    updateFit,
    getFits,
    getAllFits,
    getAllFitsByGoalType,
    getFitStatistics
};