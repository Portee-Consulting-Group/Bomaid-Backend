const { NullReferenceException, AlreadyExistsException } = require('../../errors/AppError');
const { status } = require('../common/status');
const CircleModel = require('../models/EntityModels/circleModel');
const ChallengeModel = require('../models/EntityModels/challengeModel');
const CircleChallengeModel = require('../models/EntityModels/CirclechallengeModel');
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
        if (req.body.members != '') {

            let members = req.body.members

            for (const member of members) {
                if (member == '') {
                    continue;
                }
                let user = await UserModel.find({ _id: member });
                if (user == null) {
                    throw new NullReferenceException(`user with id ${member} not found`);
                }
            }
            members.push(req.body.adminId);
            req.body.members = members;
        }else{
            req.body.members = [req.body.adminId];
        }


        if (req.body.circleImage != undefined) {
            const uploadedImage = await clodinaryService.uploadUserGoalImage(req.body.circleImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        } else {
            throw new NullReferenceException("Image is required");
        }

        circle = await CircleModel.insert(req.body);
        //add circle to every challenge
        let challenges = await ChallengeModel.findAll({});
        for (const challenge of challenges) {
            await CircleChallengeModel.insert({
                challengeId: challenge._id,
                goalTypeId: challenge.goalTypeId,
                circleId: circle._id
            });
        }
        let response = new SuccessResponse(circle, "circle added");
        res.status(status.SUCCESS).json(response);

    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

addMember = async (req, res) => {
    try {
        let circle = await CircleModel.findCircle({ _id: req.body.circleId });
        if (circle == null) {
            throw new NullReferenceException("Circle not found");
        }
        let members = req.body.members;

        for (const member of members) {
            let user = await UserModel.find({ _id: member });
            if (user == null) {
                throw new NullReferenceException(`user with id ${member} not found`);
            }
        }

        for (const member of circle.members) {
            let value = await members.includes(member);
            if (value == true) {
                throw new AlreadyExistsException(`Member with id ${member} already added`);
            }
        }
        let newVal = circle.members.push(...req.body.members);
        circle.members;

        circle = await CircleModel.update({ _id: req.body.circleId },
            {
                members: circle.members
            });
        let response = new SuccessResponse(circle, "circle updated");
        res.status(status.SUCCESS).json(response);
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

getMembers = async (req, res) => {
    try {
        var circle = await CircleModel.findCircle({ _id: req.params.circleId });
        let members = [];
        for (const member of circle.members) {
            let data = await UserModel.find({_id: member});
            data.password = undefined;
            data.token = undefined;
            members.push(data);
        }


        let response = new SuccessResponse(members, "circle members");
        res.status(status.SUCCESS).json(response);
        
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}

getAllCircles = async (req, res) => {
    try {
        let circles = await CircleModel.getAllCircles({}, req.params.page, req.params.pageSize)
        let response = new SuccessResponse(circles, "circle members");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
        
    }
}

module.exports = {
    addCircle,
    addMember,
    getAdminCircles,
    getUserCircles,
    getMembers,
    getAllCircles
};

