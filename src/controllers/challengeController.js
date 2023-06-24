const { NullReferenceException, AlreadyExistsException, CustomException, NotFoundException } = require('../../errors/AppError');
const { status } = require('../common/status');
const UserModel = require('../models/EntityModels/userModel');
const ChallengeModel = require('../models/EntityModels/challengeModel');
const FitModel = require('../models/EntityModels/fitModel');
const CircleModel = require('../models/EntityModels/circleModel');
const CircleChallengeModel = require('../models/EntityModels/CirclechallengeModel');
const UserChallengeModel = require('../models/EntityModels/userChallengeModel');
const GoalTypeModel = require('../models/EntityModels/goalTypeModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');
const { NotBeforeError } = require('jsonwebtoken');
const { constants } = require('../common/constants');


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

        if (req.body.challengeImage != undefined && req.body.challengeImage != '' ) {
            const uploadedImage = await clodinaryService.uploadChallengeImage(req.body.challengeImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        } else {
            req.body.uploadUrl = "";
            req.body.uploadId = "";
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

getChallengeByGoalType = async (req, res) => {
    try {
        const challenges = await ChallengeModel.getAllChallenges({ goalTypeId: req.params.goalTypeId }, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(challenges, "all challenges")
        res.status(status.SUCCESS).json(response);

    } catch (error) {
        res.status(status.ERROR).json({ error: err.message });
    }
}

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

addUserChallenge = async (req, res) => {
    try {
        const user = await UserModel.find({ _id: req.body.userId });
        const challenge = await ChallengeModel.findChallenge({ _id: req.body.challengeId });
        const goalType = await GoalTypeModel.find({ _id: req.body.goalTypeId });
        if (user === null || challenge == null || goalType == null) {
            throw new NotFoundException("User or goaltype or challenge not found");
        }
        const data = await UserChallengeModel.insert(req.body)

        let response = new SuccessResponse(data, "data")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}

userInChallenge = async (req, res) => {
    try {
        let user = await UserChallengeModel.findUserChallenge({ userId: req.params.userId, challengeId: req.params.challengeId})
        let isPresent = false
        if (user !== null) {
            isPresent = true;
        }
        let response = new SuccessResponse(isPresent, "User in challenge")
        res.status(status.SUCCESS).json(response);
    } catch (error) {
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
        let newCircles = [];
        for (const circle of circles) {
            const circleModel = await CircleModel.findCircle({ _id: circle.circleId });
            let circleName = ''
            if (circleModel != null) {
                circleName = circleModel.title
                newCircles.push({
                    circleName: circleName,
                    circleData: circle
                });
            }
        }
        newCircles.sort((a, b) => {
            return b.aggregatedResult - a.aggregatedResult
        });
        let response = new SuccessResponse(newCircles, "circle ranks");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}
getCircleRanksByGoalTypeId = async (req, res) => {
    try {
        let circles = await CircleChallengeModel.findAll({ goalTypeId: req.params.goalTypeId });
        let newCircles = [];
        for (const circle of circles) {
            const circleModel = await CircleModel.findCircle({ _id: circle.circleId });
            let circleName = ''
            if (circleModel != null) {
                circleName = circleModel.title
                newCircles.push({
                    circleName: circleName,
                    circleData: circle
                });
            }
        }
        console.log(newCircles)
        const sortedCircle = newCircles.sort((a, b) => b.circleData.aggregatedResult - a.circleData.aggregatedResult);
        let response = new SuccessResponse(sortedCircle, "circle ranks");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}

getIndividualFitData = async (req, res) => {
    try {
        let circle = await CircleChallengeModel.findCircleChallenge({ circleId: req.params.circleId, goalTypeId: req.params.goalTypeId });
        let challenge = await ChallengeModel.findChallenge({ _id: req.params.challengeId })
        if (challenge == null) throw new NullReferenceException("Challenge not found")

        let memberData = [];

        let circleMembers = [];
        if (circle.results.length < 1) {
            throw new NotFoundException("No members found");
        }

        circle.results.forEach((result) => {
            circleMembers.push(result.userId);
        });
        await formatIndividualData(circle.goalTypeId, circleMembers, memberData, true);

        let totalFitsInKMeters = 0
        memberData.forEach((data) => {
            totalFitsInKMeters += data.totalFitValueKMeters
        })
        let percentageOfFitCompleted = (totalFitsInKMeters / challenge.challengeTarget) * 100
        percentageOfFitCompleted = percentageOfFitCompleted > 100 ? 100 : percentageOfFitCompleted
        let memberDataResult = {
            memberData: memberData,
            percentCompleted: percentageOfFitCompleted
        }
        let response = new SuccessResponse(memberDataResult, "circle member fit values");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

getIndividualFitDataByGoalTypeId = async (req, res) => {
    try {
        let memberData = [];
        let members = []
        let allUsers = await UserModel.getAll()

        allUsers.forEach((result) => {
            members.push(result._id);
        });
        await formatIndividualData(req.params.goalTypeId, members, memberData);

        let response = new SuccessResponse(memberData, "user fit values");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};
getIndividualFitDataByChallenge = async (req, res) => {
    try {
        let members = []
        let challenge = await ChallengeModel.findChallenge({ _id: req.params.challengeId })
        if (!challenge) throw new NullReferenceException("Challenge id is required")
        let userChallengeData = await UserChallengeModel.findAll({ challengeId: req.params.challengeId, userId: req.params.userId })
        members.push(req.params.userId)
        let sum = 0
        userChallengeData.forEach(element => {
            for (const iterator of element.results) {
                sum += iterator.value
            }
        });
        let totalFitData = {
            userData: userChallengeData,
            totalFitValue: sum
        }
        let response = new SuccessResponse(totalFitData, "user challenge values");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

async function formatIndividualData(goalTypeId, circleMembers, memberData, circle = false) {

    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    day += 1;
    var year = dateObj.getUTCFullYear();

    let startDate = year + "-" + month + "-" + '1';
    let endDate = year + "-" + month + "-" + day;

    for (const member of circleMembers) {
        let fit = await FitModel.findRecentFit({
            userId: member,
            goalTypeId: goalTypeId,
            createdAt: {
                $gte: new Date(startDate).setHours(0o0, 0o0, 0o0),
                $lt: new Date(endDate).setHours(23, 59, 59)
            }
        });
        let user = await UserModel.find({ _id: member });
        if (user == null) {
            continue;
        } else {
            user.password = undefined;
            user.token = undefined;
        }


        if (fit == null || fit.length == 0) {
            if (circle) {
                memberData.push({
                    userData: user,
                    fitValue: 0,
                    totalFitValue: 0, //sum of fit values
                    totalFitValueKMeters: 0,
                    dataAdded: 0
                });
            }
            continue;
        } else {
            let totalFit = 0;
            fit.forEach(p => {
                totalFit += p.fitValue;
            });
            memberData.push({
                userData: user,
                fitValue: fit[0].fitValue,
                totalFitValue: totalFit, //sum of fit values
                totalFitValueKMeters: totalFit / constants.KILO_M, //sum of fit values
                dataAdded: fit[0].createdAt
            });
        }
    }

    memberData.sort((a, b) => {
        return b.totalFitValue - a.totalFitValue;
    });
}

module.exports = {
    addChallenge,
    updateChallenges,
    getChallenges,
    addCircleChallenge,
    updateMemberData,
    getCircleChallenges,
    getChallengeByGoalType,
    getCircleRanks,
    getCircleRanksByGoalTypeId,
    getIndividualFitData,
    getIndividualFitDataByGoalTypeId,
    addUserChallenge,
    getIndividualFitDataByChallenge,
    userInChallenge
}
