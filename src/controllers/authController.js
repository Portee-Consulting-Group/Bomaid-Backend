const jwtSecret = process.env.SESSION_SECRET;
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { status } = require('../common/status');
const SuccessResponse = require('../models/viewModels/responseModel');
const UserModel = require('../models/EntityModels/userModel');
const OrganizationLevelModel = require('../models/EntityModels/organizationalLevelModel');
const SurveyResponseModel = require('../models/EntityModels/surveyResponseModel');
const TargetModel = require('../models/EntityModels/targetModel');
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
        { email: email},
        process.env.SESSION_SECRET,
        {
            expiresIn: "24h"
        }
    )
    return token;


    // let refreshId = req.userId + jwtSecret;
    // let salt = crypto.randomBytes(16).toString('base64');
    // let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
    // req.refreshKey = salt;
    // const reqBody = {
    //     body: {
    //         refreshId: refreshId,
    //         refreshKey: req.refreshKey
    //     }
    // };
    // let token = jwt.sign(reqBody, jwtSecret);
    // let b = Buffer.from(hash);
    // let refresh_token = b.toString('base64');
    // let tokenObject = {
    //     accessToken: token,
    //     refreshToken: refresh_token
    // };
    // return tokenObject;
};
sendSupportEmail = async (req,res)=>{
    await supportEmail(req.body.message);
    res.status(status.SUCCESS).json({message: "Message sent"});
}

getOrganizationLevels = async (req, res) => {
    const response = await OrganizationLevelModel.getAllLevels();
    res.status(status.SUCCESS).json({ message: response})
}

getSurveyTargets = async (req, res) => {
    const response = await TargetModel.getAllTargets();
    res.status(status.SUCCESS).json({ message: response})
}

getSurveyResponse = async (req, res) => {
    const response = await SurveyResponseModel.getAllResponses();
    res.status(status.SUCCESS).json({ message: response})
}



module.exports = {
    local_login,
    generateJwtToken,
    sendSupportEmail,
    getOrganizationLevels,
    getSurveyTargets,
    getSurveyResponse
}