const jwtSecret = process.env.SESSION_SECRET;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { status } = require('../common/status');
const SuccessResponse = require('../models/viewModels/responseModel');
const UserModel = require('../models/EntityModels/userModel');
const OrganizationLevelModel = require('../models/EntityModels/organizationalLevelModel');
const SurveyResponseModel = require('../models/EntityModels/surveyResponseModel');
const TargetModel = require('../models/EntityModels/targetModel');
const PermissionModel = require('../models/EntityModels/permissionModel');
const { supportEmail } = require('../services/EmailService');

local_login = async (req, res) => {
    try {
        const tokenObject = await generateJwtToken(req.body.email);
        const user = await UserModel.update({ email: req.body.email }, { token: tokenObject })
        user.password = undefined;
        let response = new SuccessResponse(user, "Successful login");
        res.status(status.SUCCESS).json({ message: response });
    } catch (error) {
        res.status(status.ERROR).json({ message: err.message });
    }
};

refresh_token = (req, res) => {
    try {
        req.body = req.user;
        let token = jwt.sign(req.body, jwtSecret);
        res.status(status.SUCCESS).json({ id: token });
    } catch (err) {
        res.status(status.ERROR).json({ message: err.message });
    }
};

generateJwtToken = async (email) => {
    const token = jwt.sign(
        { email: email },
        process.env.SESSION_SECRET,
        {
            expiresIn: "24h"
        }
    )
    return token;
}
sendSupportEmail = async (req, res) => {
    await supportEmail(req.body.message);
    res.status(status.SUCCESS).json({ message: "Message sent" });
}

getOrganizationLevels = async (req, res) => {
    const response = await OrganizationLevelModel.getAllLevels();
    res.status(status.SUCCESS).json({ message: response })
}

getSurveyTargets = async (req, res) => {
    const response = await TargetModel.getAllTargets();
    res.status(status.SUCCESS).json({ message: response })
}

getSurveyResponse = async (req, res) => {
    const response = await SurveyResponseModel.getAllResponses();
    res.status(status.SUCCESS).json({ message: response })
}


createPermission = async (req, res) => {
    try {
        let users = await UserModel.findAll({});
        if (users.length < 1) throw new NotFoundException("no users found");

        for (const user of users) {
            let permit = await PermissionModel.find({ userId: user._id })
            if (permit != null) return;
            await PermissionModel.add({
                userId: user._id
            });
        }
        res.status(status.SUCCESS).json({ message: "done" });
    } catch (error) {
        res.status(status.ERROR).json({ message: err.message });
    }
}

updatePermission = async (req, res) => {
    try {
        let permit = await PermissionModel.find({ userId: req.body.userId })
        if (permit == null) {
            permit = await PermissionModel.add({
                userId: req.body.userId
            });
        } else {
            permit = await PermissionModel.update({ userId: req.body.userId }, req.body)
        }

        let response = new SuccessResponse(permit, "Permission updated");
        res.status(status.SUCCESS).json({ message: response });

    } catch (error) {
        res.status(status.ERROR).json({ message: error.message });
    }
}

addNewPermission = async (userId) => {
    try {
        let permit = await PermissionModel.find({ userId: userId })
        if (permit == null) {
            permit = await PermissionModel.add({
                userId: userId
            });
        } else {
            permit = await PermissionModel.update({ userId: userId }, req.body)
        }
        
    } catch (error) {
        res.status(status.ERROR).json({ message: error.message });
    }
}

getUserPermission = async (req, res) => {
    try {
        let permit = await PermissionModel.find({ userId: req.params.userId })
        if (permit == null) throw new NotFoundException("Permission not found");

        let response = new SuccessResponse(permit, "Permission updated");
        res.status(status.SUCCESS).json({ message: response });
    } catch (error) {
        res.status(status.ERROR).json({ message: err.message });
    }
}



module.exports = {
    local_login,
    generateJwtToken,
    sendSupportEmail,
    getOrganizationLevels,
    getSurveyTargets,
    getSurveyResponse,
    createPermission,
    updatePermission,
    addNewPermission,
    getUserPermission
}