const { NullReferenceException, AlreadyExistsException } = require('../../errors/AppError');
const { status } = require('../common/status');
const UserGoalModel = require('../models/EntityModels/userGoalModel');
const UserModel = require('../models/EntityModels/userModel');
const GoalTypeModel = require('../models/EntityModels/goalTypeModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');


addGoal = async (req, res) => {
    try {
        let type = await GoalTypeModel.find({ _id: req.body.goalTypeId });
        if (type == null) {
            throw new NullReferenceException("Type not found");
        }
        let user = await UserModel.find({ _id: req.body.userId });
        if (user == null) {
            throw new NullReferenceException("User not found");
        }

        const goalAlreadyAdded = await UserGoalModel.find({userId: req.body.userId, goalTypeId: req.body.goalTypeId});
        if(goalAlreadyAdded != null) throw new AlreadyExistsException("Goal type already added for user");
        
        if (typeof req.body.reminderTimes === 'string') {
            let reminders = req.body.reminderTimes.split(",");
            req.body.reminderTimes = reminders;
        }
        if (req.body.userGoalImage != undefined) {
            const uploadedImage = await clodinaryService.uploadUserGoalImage(req.body.userGoalImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        } else {
            throw new NullReferenceException("Image is required");
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
        if (req.body.userGoalImage != undefined) {
            const uploadedImage = await clodinaryService.uploadUserGoalImage(req.body.userGoalImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        } else {
            // req.body.uploadUrl = "";
            // req.body.uploadId = "";
        }
        goal = await UserGoalModel.update({ _id: req.body.goalId }, req.body);
        let response = new SuccessResponse(goal, "goal updated");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}

updateGoalValue = async (req, res) => {
    try {
        let goal = await UserGoalModel.find({ _id: req.body.goalId });
        if (goal == null) {
            throw new NullReferenceException("Goal not found");
        }
        req.body.goalValue += goal.goalValue;
        goal = await UserGoalModel.update({ _id: req.body.goalId }, req.body);
        let response = new SuccessResponse(goal, "goal updated");
        res.status(status.SUCCESS).json(response);
    } catch (err) {

        res.status(status.ERROR).json({ error: err.message });
    }
}

getGoals = async (req, res) => {
    try {
        var goals = await UserGoalModel.getGoals({userId: req.params.userId}, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(goals, "user goals")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

module.exports = {
    addGoal,
    updateGoal,
    getGoals,
    updateGoalValue
}