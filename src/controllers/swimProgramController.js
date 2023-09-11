const { NotFoundException } = require('../../errors/AppError');
const { status } = require('../common/status');
const UserModel = require('../models/EntityModels/userModel');
const SwimStyleModel = require('../models/EntityModels/swimStyleModel');
const SwimProgramModel = require('../models/EntityModels/swimProgramModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');


addProgram = async (req, res) => {
    try {
        req.body.photoUrls = []
        let user = await UserModel.find({ userId: req.body.userId });
        if (user == null) throw new NotFoundException("User not found");
        let style = await SwimStyleModel.find({ _id: req.body.styleId });
        if (style == null) throw new NotFoundException("Style not found");

        for (const image of req.body.imageUrls) {
            const uploadedImage = await clodinaryService.uploadSwimProgramImage(image);
            req.body.photoUrls.push(uploadedImage.url)
        }
        type = await SwimProgramModel.add(req.body);
        let response = new SuccessResponse(type, "program added");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};


getUserProgram = async (req, res) => {
    try {
        var types = await SwimProgramModel.getPrograms({ userId: req.params.userId }, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(types, "swim program")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};


module.exports = {
    addProgram,
    getUserProgram
}