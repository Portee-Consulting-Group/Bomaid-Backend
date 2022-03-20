const { AlreadyExistsException } = require('../../errors/AppError');
const { status } = require('../common/status');
const GoalTypeModel = require('../models/EntityModels/goalTypeModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');


addGoalType = async (req, res) => {
    try {
        var type = await GoalTypeModel.find({value: req.body.value});
        if(type != null){
            throw new AlreadyExistsException("Goal type already exists");
        }
        if (req.body.goalTypeImage != undefined) {
            const uploadedImage = await clodinaryService.uploadGoalTypeImage(req.body.goalTypeImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        } else {
            throw new CustomException("Please attach goal image");
        }
        type = await GoalTypeModel.add(req.body);
        let response = new SuccessResponse(type, "type added");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

getTypes = async (req, res) => {
    try{
        var types = await GoalTypeModel.getActiveTypes(req.page, req.pageSize);
        let response = new SuccessResponse(types, "goal types")
        res.status(status.SUCCESS).json(response);
    }catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

module.exports = {
    addGoalType,
    getTypes
}