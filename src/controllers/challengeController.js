const { NullReferenceException, AlreadyExistsException, CustomException, NotFoundException } = require('../../errors/AppError');
const { status } = require('../common/status');
const UserModel = require('../models/EntityModels/userModel');
const ChallengeModel = require('../models/EntityModels/challengeModel');
const FitModel = require('../models/EntityModels/fitModel');
const CircleModel = require('../models/EntityModels/circleModel');
const CircleChallengeModel = require('../models/EntityModels/CirclechallengeModel');
const GoalTypeModel = require('../models/EntityModels/goalTypeModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');
const { NotBeforeError } = require('jsonwebtoken');


addChallenge = async (req, res) => {
    try {
        const goalType = await GoalTypeModel.find({ _id: req.body.goalTypeId });
        if (goalType == null) {
            throw new NullReferenceException("goal type not found");
        }
        let challenge = await ChallengeModel.findChallenge({ title: req.body.title.toLowerCase() })
        if (challenge != null) {
            throw new AlreadyExistsException("Challenge has been added");
        }

        if (req.body.challengeImage != undefined) {
            const uploadedImage = await clodinaryService.uploadChallengeImage(req.body.challengeImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        } else {
            throw new NullReferenceException("Image is required");
        }

        challenge = await ChallengeModel.insert(req.body);
        let response = new SuccessResponse(goalType, "challenge added");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

updateChallenges = async (req, res) => {
    try {
        let challenge = await ChallengeModel.findChallenge({ _id: req.body.challengeId });
        if (challenge == null) {
            throw new NullReferenceException("Challenge not found");
        }
        if (req.body.challengeImage != undefined) {
            const uploadedImage = await clodinaryService.uploadChallengeImage(req.body.challengeImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        }

        challenge = await ChallengeModel.update({ _id: req.body.challengeId }, req.body);
        let response = new SuccessResponse(challenge, "challenge updated");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

getChallenges = async (req, res) => {
    try {
        const challenges = await ChallengeModel.getAllChallenges({}, req.params.page, req.params.pageSize);
        let data = [];
        for (const challenge of challenges) {
            let goalObj;
            let goalType = await GoalTypeModel.find({ _id: challenge.goalTypeId });
            goalObj = Object.assign({}, challenge._doc, { goalName: goalType.name });
            data.push(goalObj);
        }
        let response = new SuccessResponse(data, "all challenges")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

addCircleChallenge = async (req, res) => {
    try {
        let challenge = await ChallengeModel.findChallenge({ _id: req.body.challengeId });
        if (challenge == null) {
            throw new NullReferenceException("Challenge not found");
        }
        let circle = await CircleModel.findCircle({ _id: req.body.circleId });
        if (circle == null) {
            throw new NullReferenceException("circle not found");
        }
        let newData = await CircleChallengeModel.findCircleChallenge({ challengeId: req.body.challengeId, circleId: req.body.circleId });
        if (newData != null) {
            throw new AlreadyExistsException("Only one challenge of the same type cannot be added to a circle");
        }
        req.body.goalTypeId = challenge.goalTypeId;
        let data = await CircleChallengeModel.insert(req.body);
        let response = new SuccessResponse(data, "data")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}

updateMemberData = async (req, res) => {
    try {
        let circleChallenge = await CircleChallengeModel.findCircleChallenge({ _id: req.body.circleChallengeId });
        let circleChallengeResult = circleChallenge.aggregatedResult;

        if (circleChallenge == null) {
            throw new NullReferenceException("Circle challenge not found");
        }
        let circle = await CircleModel.findCircle({ _id: circleChallenge.circleId });
        if (circle == null) {
            throw new NullReferenceException("Circle not found");
        }
        let challengeResults = req.body.results;
        if (challengeResults.length < 1) {
            throw new CustomException("Results cannot be empty");
        }
        for (const item of challengeResults) {
            if (!circle.members.includes(item.userId)) {
                throw new NullReferenceException("User must belong to this circle");
            }
        }
        for (const item of challengeResults) {
            if (item.userId == '' || item.value == '') {
                throw new CustomException("pass accurate data");
            }
            if (circleChallenge.results.some(e => e.userId === item.userId)) {
                let user = circleChallenge.results.find(e => e.userId == item.userId);
                let index = circleChallenge.results.findIndex(e => e.userId == item.userId);
                user.value += item.value;
                circleChallenge.results[index].value = user.value
                circleChallengeResult += item.value;
            } else {
                circleChallenge.results.push(item);
                circleChallengeResult += item.value;
            }
        }

        let data = await CircleChallengeModel.update({ _id: req.body.circleChallengeId },
            {
                results: circleChallenge.results,
                aggregatedResult: circleChallengeResult
            });

        let response = new SuccessResponse(data, "data")
        res.status(status.SUCCESS).json(response);

    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}
getCircleChallenges = async (req, res) => {
    try {
        const challenges = await CircleChallengeModel.getResults({ circleId: req.params.circleId }, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(challenges, "all circle challenges")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}


getCircleRanks = async (req, res) => {
    try {
        let circles = await CircleChallengeModel.findAll({ challengeId: req.params.challengeId });
        circles.sort((a, b) => {
            return b.aggregatedResult - a.aggregatedResult
        });
        let response = new SuccessResponse(circles, "circle ranks");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}

getIndividualFitData = async (req, res) => {
    try {
        let circle = await CircleChallengeModel.findCircleChallenge({ circleId: req.params.circleId, goalTypeId: req.params.goalTypeId });
        let memberData = [];
        let circleMembers = [];
        if (circle.results.length < 1) {
            throw new NotFoundException("No members found");
        }
        circle.results.forEach((result) => {
            circleMembers.push(result.userId);
        });

        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1; //months from 1-12
        var day = dateObj.getUTCDate();
        day +=1;
        var year = dateObj.getUTCFullYear();

        let startDate = year + "-" + month + "-" + '1';
        let endDate = year + "-" + month + "-" + day;

        for (const member of circleMembers) {
            let fit = await FitModel.findRecentFit({
                userId: member, goalTypeId: circle.goalTypeId
                ,
                createdAt: {
                    $gte: new Date(startDate).setHours(00, 00, 00),
                    $lt: new Date(endDate).setHours(23, 59, 59)
                }
            });
            let user = await UserModel.find({ _id: member });
            user.password = undefined;
            user.token = undefined;
            if (user == null) {
                contine;
            }

            
            if (fit == null || fit.length == 0) {
                memberData.push({
                    userData: user,
                    fitValue: 0,
                    totalFitValue: 0
                });
            } else {
                let totalFit = 0;
                fit.forEach(p=>{
                    totalFit += p.fitValue;
                })
                memberData.push({
                    userData: user,
                    fitValue: fit[0].fitValue,
                    totalFitValue: totalFit//sum of fit values
                });
            }
        }

        memberData.sort((a, b) => {
            return b.fitValue - a.fitValue;
        });

        let response = new SuccessResponse(memberData, "circle member fit values");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

module.exports = {
    addChallenge,
    updateChallenges,
    getChallenges,
    addCircleChallenge,
    updateMemberData,
    getCircleChallenges,
    getCircleRanks,
    getIndividualFitData
}