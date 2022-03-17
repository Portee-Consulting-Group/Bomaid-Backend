const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const circleMemberSchema = new Schema({
    circleId: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Number, required: true, default: statusEnum.active.value },
    type: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now},
    updatedAt: { type: Date, default: Date.now}
});

const CircleMember = mongoose.model('CircleMembers', circleMemberSchema);

insert = (circleMemberData) => {
    const circleMember = new CircleMember(circleMemberData);
    circleMember.save();
    return circleMember;
};

findMember = async (query) => {
    const value = await CircleMember.findOne(query);
    if (value == null) {
        return null;
    }
    return value;
};

getAllMembers = async (query) => {
    const circleMembers = await CircleMember.find(query);
    return circleMembers;
}

update = async (query, circleMemberData) => {
    return CircleMember.findOneAndUpdate(query, circleMemberData, { new: true });
};

module.exports = {
    insert,
    findMember,
    update,
    getAllMembers
}