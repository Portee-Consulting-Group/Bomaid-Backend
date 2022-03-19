const { NullReferenceException, AlreadyExistsException, CustomException } = require('../../errors/AppError');
const { status } = require('../common/status');
const UserModel = require('../models/EntityModels/userModel');
const ChallengeModel = require('../models/EntityModels/challengeModel');
const CircleModel = require('../models/EntityModels/circleModel');
const CircleChallengeModel = require('../models/EntityModels/CirclechallengeModel');
const GoalTypeeModel = require('../models/EntityModels/goalTypeModel');
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');

addChallenge = async (req, res) => {
    try {
        const goalType = await GoalTypeeModel.find({ _id: req.body.goalTypeId });
        if (goalType == null) {
            throw new NullReferenceException("goal type not found");
        }
        let challenge = await ChallengeModel.findChallenge({ title: req.body.title.toLowerCase() })
        if (challenge != null) {
            throw new AlreadyExistsException("Challenge has been added");
        }

        if (req.file != undefined) {
            const uploadedImage = await clodinaryService.uploadChallengeImage(req.file.path);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        } else {
            throw new NullReferenceException("Image is required");
        }

        challenge = await ChallengeModel.insert(req.body);
        let response = new SuccessResponse(goalType, "challenge added");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

updateChallenges = async (req, res) => {
    try {
        let challenge = await ChallengeModel.findChallenge({ _id: req.body.challengeId });
        if (challenge == null) {
            throw new NullReferenceException("Challenge not found");
        }
        if (req.file != undefined) {
            const uploadedImage = await clodinaryService.uploadChallengeImage(req.file.path);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        }

        challenge = await ChallengeModel.update({ _id: req.body.challengeId }, req.body);
        let response = new SuccessResponse(challenge, "challenge updated");
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

getChallenges = async (req, res) => {
    try {
        const challenge = await ChallengeModel.getAllChallenges({}, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(challenge, "all challenges")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

addCircleChallenge = async (req, res) => {
    try {
        let challenge = await ChallengeModel.findChallenge({ _id: req.body.challengeId });
        if (challenge == null) {
            throw new NullReferenceException("Challenge not found");
        }
        let circle = await CircleModel.findCircle({ _id: req.body.circleId });
        if (circle == null) {
            throw new NullReferenceException("circle not found");
        }
        let data = await CircleChallengeModel.insert(req.body);
        let response = new SuccessResponse(data, "data")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}

updateMemberData = async (req, res) => {
    try {
        let circleChallenge = await CircleChallengeModel.findCircleChallenge({ _id: req.body.circleChallengeId });

        if (circleChallenge == null) {
            throw new NullReferenceException("Circle challenge not found");
        }
        if (req.body.results.length < 1) {
            throw new CustomException("Results cannot be empty");
        }
        // for (const iterator of req.body.results) {
        //     if () {

        //     }
        // }

        let data = await CircleChallengeModel.update({ _id: req.body.circleChallengeId },
            {

            });

        let response = new SuccessResponse(data, "data")
        res.status(status.SUCCESS).json(response);

    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}
getCircleChallenges = async (req, res) => {
    try {
        const challenges = await CircleChallengeModel.getResults({ circleId: req.params.circleId }, req.params.page, req.params.pageSize);
        let response = new SuccessResponse(challenges, "all circle challenges")
        res.status(status.SUCCESS).json(response);
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
}

module.exports = {
    addChallenge,
    updateChallenges,
    getChallenges
}