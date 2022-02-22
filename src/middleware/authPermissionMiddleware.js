const jwt = require('jsonwebtoken');
const { status } = require('../common/status');
const secret = process.env.SESSION_SECRET;
const userEnum = require('../common/enum').getUserEnum();
const UserTypeModel = require('../models/EntityModels/userTypeModel');

exports.adminLevelRequired = async (req, res, next) => {
    // return (req, res, next) => {
        let type = await UserTypeModel.find({_id: req.jwt.userTypeId});
        if (type.value == userEnum.admin.value) {
            return next();
        } else {
            return res.status(status.ERROR).send({error: 'Only admin can do this'});
        }
    // };
};

// exports.onlySameUserOrAdminCanDoThisAction = (req, res, next) => {

//     let user_type = parseInt(req.jwt.userType);
//     let userId = req.jwt.userId;
//     if (req.params && req.params.userId && userId === req.params.userId) {
//         return next();
//     } else {
//         if (user_type & enums[1]) {
//             return next();
//         } else {
//             return res.status(status.ERROR).send({error: 'Invalid refresh token'});
//         }
//     }
// };

// exports.sameUserCantDoThisAction = (req, res, next) => {
//     let userId = req.jwt.userId;

//     if (req.params.userId !== userId) {
//         return next();
//     } else {
//         return res.status(status.ERROR).json({error: 'Please log in current user'});
//     }
// };
