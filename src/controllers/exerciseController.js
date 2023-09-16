const { NotFoundException } = require('../../errors/AppError');
const { status } = require('../common/status');
const ExerciseModel = require('../models/EntityModels/exerciseModel');
const UserModel = require('../models/EntityModels/userModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');


add = async (req, res) => {
    try {
        if (req.body.exerciseImage != undefined && req.body.exerciseImage !== '') {
            const uploadedImage = await clodinaryService.uploadGymExerciseImage(req.body.exerciseImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        }
        type = await ExerciseModel.add(req.body);
        let response = new SuccessResponse(type, "exercise added");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};
addBodyId = async (req, res) => {
    try {
        const exercise = await ExerciseModel.find({ _id: req.body.exerciseId });
        if (exercise == null) throw NotFoundException('exercise not found');

        exercise.bodyId.push(...req.body.bodyId);

        const updateExercise = await ExerciseModel.update({ _id: req.body.exerciseId }, {
            bodyId: exercise.bodyId
        });

        let response = new SuccessResponse(updateExercise, "exercise updated");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};


getAll = async (req, res) => {
    try {
        var styles = await ExerciseModel.getStyles({}, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(styles, "exercises")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

module.exports = {
    add,
    addBodyId,
    getAll
}