const { NullReferenceException, AlreadyExistsException } = require('../../errors/AppError');
const { status } = require('../common/status');
const CircleModel = require('../models/EntityModels/circleModel');
const CircleMemberModel = require('../models/EntityModels/circleMemberModel');
const UserModel = require('../models/EntityModels/userModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');

addCircle = async (req, res) => {
    try {
        let circle = await CircleModel.findCircle({ title: req.body.title.toLowerCase(), adminId: req.body.adminId });
        if (circle != null) {
            throw new AlreadyExistsException("Circle already added by user");
        }
        let user = await UserModel.find({ _id: req.body.adminId });
        if (user == null) {
            throw new NullReferenceException("User not found");
        }
        let members = req.body.members.split(",")

        for (const member of members) {
            let user = await UserModel.find({ _id: member });
            if (user == null) {
                throw new NullReferenceException(`user with id ${member} not found`);
            }
        }
        req.body.members = members;

        if (req.file != undefined) {
            const uploadedImage = await clodinaryService.uploadUserGoalImage(req.file.path);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        } else {
            throw new NullReferenceException("Image is required");
        }

        circle = await CircleModel.insert(req.body);
        let response = new SuccessResponse(circle, "circle added");
        res.status(status.SUCCESS).json(response);

    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

addMember = async (req, res) => {
    try {

    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

getAdminCircles = async (req, res) => {
    try {
        var circles = await CircleModel.getAllCircles({ adminId: req.params.adminId }, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(circles, "admin circles")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

getUserCircles = async (req, res) => {
    try {
        var circles = await CircleModel.getAllCircles({ members: req.params.userId }, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(circles, "user circles")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

module.exports = {
    addCircle,
    addMember,
    getAdminCircles,
    getUserCircles
};

