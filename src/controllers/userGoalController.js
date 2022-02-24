const { NullReferenceException } = require('../../errors/AppError');
const { status } = require('../common/status');
const UserGoalModel = require('../models/EntityModels/userGoalModel');
const UserModel = require('../models/EntityModels/UserModel');
const GoalTypeModel = require('../models/EntityModels/goalTypeModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');


addGoal = async (req, res) => {
    try {
        let type = await GoalTypeModel.find({_id: req.body.goalTypeId});
        if(type == null){
            throw new NullReferenceException("Type not found");
        }
        let user = await UserModel.find({ _id: req.body.userId });
        if (user == null) {
            throw new NullReferenceException("User not found");
        }
        if (req.body.reminderTimes != '') {
            let reminders = req.body.reminderTimes.split(",");
            req.body.reminderTimes = reminders;
        }
        if (req.file != undefined) {
            const uploadedImage = await clodinaryService.uploadUserGoalImage(req.file.path);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        } else {
            req.body.uploadUrl = "";
            req.body.uploadId = "";
        }
        goal = await UserGoalModel.add(req.body);
        let response = new SuccessResponse(goal, "goal added");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

updateGoal = async (req, res) => {
    try {
        let goal = await UserGoalModel.find({ _id: req.body.goalId });
        if (goal == null) {
            throw new NullReferenceException("Goal not found");
        }
        if (req.file != undefined) {
            const uploadedImage = await clodinaryService.uploadUserGoalImage(req.file.path);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        } else {
            req.body.uploadUrl = "";
            req.body.uploadId = "";
        }
        goal = await UserGoalModel.update({ _id: req.body.goalId }, req.body);
        let response = new SuccessResponse(goal, "goal updated");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}

getGoals = async (req, res) => {
    try {
        var goals = await UserGoalModel.getGoals({}, req.page, req.pageSize);
        let response = new SuccessResponse(goals, "user goals")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

module.exports = {
    addGoal,
    updateGoal,
    getGoals
}