const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const orgLevelSchema = new Schema({
    name: { type: String, required: true },
    type: { type: Number, required: true, unique: true },
    status: { type: Number, required: true, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const OrgLevel = mongoose.model('OrganizationLevel', orgLevelSchema);

insert = (data) => {
    const level = new OrgLevel(data);
    level.save();
    return level;
};

insertMany = async (data) => {
    let allLevels = await getAllLevels();
    if (allLevels.length == 0) {
        const response = await OrgLevel.insertMany(data);
    }
}

findLevel = async (query) => {
    const value = await OrgLevel.findOne(query);
    if (value == null) {
        return null;
    }
    return value;
};

getAllLevels = async (query) => {
    const levels = await OrgLevel.find(query);
    return levels;
}


update = async (query, data) => {
    return OrgLevel.findOneAndUpdate(query, data, { new: true });
};

module.exports = {
    insert,
    insertMany,
    findLevel,
    update,
    getAllLevels
}