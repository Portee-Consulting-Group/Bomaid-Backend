const { NotFoundException } = require('../../errors/AppError');
const { status } = require('../common/status');
const BodyModel = require('../models/EntityModels/bodyModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');


add = async (req, res) => {
    try {
        if (req.body.bodyImage != undefined && req.body.bodyImage !== '' ) {
            const uploadedImage = await clodinaryService.uploadSwimStyleImage(req.body.bodyImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        }
        type = await BodyModel.add(req.body);
        let response = new SuccessResponse(type, "style added");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};


getAll = async (req, res) => {
    try {
        var styles = await BodyModel.findAll({}, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(styles, "styles")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

module.exports = {
    add,
    getAll
}