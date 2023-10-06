const { NotFoundException } = require('../../errors/AppError');
const { status } = require('../common/status');
const GymProgramModel = require('../models/EntityModels/gymProgramModel');
const UserModel = require('../models/EntityModels/userModel');
const ExerciseModel = require('../models/EntityModels/exerciseModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');


let programDetails = {
    set: String,
    reps: Number,
    weight: Number,
    restTime: String,
    exercise: String
}

add = async (req, res) => {
    try {
        req.body.photoUrls = [];
        req.body.programData = [];
        let user = await UserModel.find({ userId: req.body.userId });
        if (user == null) throw new NotFoundException("User not found");

        // for (const item of req.body.programDetails) {
        //     let exercise = await ExerciseModel.find({ _id: item.exerciseId });
        //     if (exercise == null) throw new NotFoundException("Exercise not found");
        // }

        req.body.programData.push(...req.body.programDetails);
        for (const image of req.body.imageUrls) {
            const uploadedImage = await clodinaryService.uploadGymExerciseImage(image);
            req.body.photoUrls.push(uploadedImage.url)
        }
        type = await GymProgramModel.add(req.body);
        let response = new SuccessResponse(type, "program added");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};


getAll = async (req, res) => {
    try {
        var styles = await GymProgramModel.getGymPrograms({}, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(styles, "all gym programs")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

module.exports = {
    add,
    getAll
}