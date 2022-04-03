const { NullReferenceException, AlreadyExistsException } = require('../../errors/AppError');
const { status } = require('../common/status');
const PointModel = require('../models/EntityModels/pointModel');
const UserModel = require('../models/EntityModels/userModel');
const GoalTypeModel = require('../models/EntityModels/goalTypeModel');
const FitModel = require('../models/EntityModels/fitModel');
const CircleChallengeModel = require('../models/EntityModels/CirclechallengeModel');
const SuccessResponse = require('../models/viewModels/responseModel');

calculateUserPoint = async (req, res) => {
    try {
        const user = await UserModel.find({ _id: req.body.userId });
        if (user == null) {
            throw new NullReferenceException("User not found");
        }
        const goaltype = await GoalTypeModel.find({ _id: req.body.goalTypeId });
        if (goaltype == null) {
            throw new NullReferenceException("Goaltype not found");
        }

        let points = 0;
        let distance = 0;
        let fitArray = [];
        let challengeArray = [];


        let fitData = await FitModel.findAll({ userId: req.body.userId, goalTypeId: req.body.goalTypeId });
        if (fitData != null) {
            for (const data of fitData) {
                fitArray.push(data.fitValue);
            }
        }

        let challengeData = await CircleChallengeModel.findAll({ goalTypeId: req.body.goalTypeId });
        for (const iterator of challengeData) {
            iterator.results.forEach((result) => {
                if (result.userId == req.body.userId) {
                    challengeArray.push(result.value);
                }
            });
        }

        //get distance covered
        for (let index = 0; index < fitArray.length; index++) {
            distance += fitArray[index];
        }
        for (let index = 0; index < challengeArray.length; index++) {
            distance += challengeArray[index];
        }

        //calculate point
        points = Math.round(distance / goaltype.unitPoint); // divide total distance by unitpoint of a goal type

        let pointModel = await PointModel.find({ userId: req.body.userId, goalTypeId: req.body.goalTypeId });
        if (pointModel == null) {
            pointModel = await PointModel.add({
                currentPoint: points,
                distanceCovered: distance,
                goalTypeId: req.body.goalTypeId,
                userId: req.body.userId
            });
        } else {
            pointModel = await PointModel.update({ _id: pointModel._id }, {
                currentPoint: points,
                distanceCovered: distance
            });
        }
        let response = new SuccessResponse(pointModel, "point added");
        res.status(status.SUCCESS).json(response);


    } catch (error) {
        res.status(status.ERROR).json({ error: error.message });
    }
}

module.exports = {
    calculateUserPoint
}
