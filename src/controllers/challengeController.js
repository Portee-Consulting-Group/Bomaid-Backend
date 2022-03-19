const { NullReferenceException, AlreadyExistsException, CustomException } = require('../../errors/AppError');
const { status } = require('../common/status');
const UserModel = require('../models/EntityModels/userModel');
const ChallengeModel = require('../models/EntityModels/challengeModel');
const SuccessResponse = require('../models/viewModels/responseModel');

addChallenge = async (req, res, next) => {
    try {
        
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

updateChallenges = async (req, res) => {
    try {
        
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

getChallenges = async (req, res) => {
    try {
        
    } catch (err) {
        res.status(status.ERROR).json({ error: err.message });
    }
};

module.exports = {
    addChallenge,
    updateChallenges,
    getChallenges
}