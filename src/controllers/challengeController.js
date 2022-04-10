const { NullReferenceException, AlreadyExistsException, CustomException } = require('../../errors/AppError');
const { status } = require('../common/status');
const UserModel = require('../models/EntityModels/userModel');
const ChallengeModel = require('../models/EntityModels/challengeModel');
const FitModel = require('../models/EntityModels/fitModel');
const CircleModel = require('../models/EntityModels/circleModel');
const CircleChallengeModel = require('../models/EntityModels/CirclechallengeModel');
const GoalTypeeModel = require('../models/EntityModels/goalTypeModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');


addChallenge = async (req, res) => {
    try {
        const goalType = await GoalTypeeModel.find({ _id: req.body.goalTypeId });
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
        const challenge = await ChallengeModel.getAllChallenges({}, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(challenge, "all challenges")
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
        let circle = await CircleChallengeModel.findCircleChallenge({ circleId: req.params.circleId, challengeId: req.params.challengeId });
        let memberData = [];
        let circleMembers = [];
        circle.results.forEach((result) => {
            circleMembers.push(result.userId);
        });


        for (const member of circleMembers) {
            let fit = await FitModel.findFit({ userId: member, goalTypeId: circle.goalTypeId });
            if (fit == null) {
                memberData.push({
                    userId: member,
                    fitValue: 0
                });
            }
            memberData.push({
                userId: member,
                fitValue: fit.fitValue
            });
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