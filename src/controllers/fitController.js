const { NullReferenceException, AlreadyExistsException } = require('../../errors/AppError');
const { status } = require('../common/status');
const FitModel = require('../models/EntityModels/fitModel');
const UserModel = require('../models/EntityModels/userModel');
const GoalTypeModel = require('../models/EntityModels/goalTypeModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');

addFit = async (req, res) => {
    try {
        let user = await UserModel.find({ _id: req.body.userId });
        if (user == null) {
            throw new NullReferenceException("User not found");
        }
        let goaltype = await GoalTypeModel.find({_id: req.body.goalTypeId});
        if(goaltype == null) {
            throw new NullReferenceException("goal type not found");
        }
        let fit = await FitModel.insert(req.body);
        let response = new SuccessResponse(fit, "fit added");
        res.status(status.SUCCESS).json(response);
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

module.exports = {
    addFit,
    updateFit,
    getFits,
    getAllFits
};