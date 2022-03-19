const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();

const goalTypeSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    uploadUrl: { type: String, default: "" },
    uploadId: { type: String, default: "" },
    value: { type: String, required: true, unique: true },
    status: { type: Number, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const GoalType = mongoose.model('GoalTypes', goalTypeSchema);


add = async (data) => {
    const type = new GoalType(data);
    await type.save();
    return type;
};

update = async (query, data) => {
    return GoalType.findOneAndUpdate(query, data, { new: true });
};

find = async (query) => {
    return GoalType.findOne(query);
};

getActiveTypes = async (page, pageSize) => {
    return GoalType.find({ status: statusEnum.active.value })
        .sort({ _id: -1 })
        .skip(page)
        .limit(pageSize);
};

module.exports = {
    add,
    update,
    find,
    getActiveTypes
}