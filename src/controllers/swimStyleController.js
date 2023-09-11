const { NotFoundException } = require('../../errors/AppError');
const { status } = require('../common/status');
const SwimStyleModel = require('../models/EntityModels/swimStyleModel');
const UserModel = require('../models/EntityModels/userModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');


addStyle = async (req, res) => {
    try {
        if (req.body.feedImage != undefined) {
            const uploadedImage = await clodinaryService.uploadSwimStyleImage(req.body.styleImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        }
        type = await SwimStyleModel.add(req.body);
        let response = new SuccessResponse(type, "style added");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};


getSwimStyles = async (req, res) => {
    try {
        var styles = await SwimStyleModel.getStyles({}, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(styles, "styles")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

module.exports = {
    addStyle,
    getSwimStyles
}