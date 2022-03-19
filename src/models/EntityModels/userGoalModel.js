const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();

const userGoalSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: String, required: true },
    goalTypeId: { type: String, required: true },
    status: { type: Number, default: statusEnum.active.value },
    reminderTimes: [{ type: String }],
    goalValue: { type: Number, default: 0 },
    uploadUrl: { type: String, default: "" },
    uploadId: { type: String, default: "" },
    endDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const UserGoal = mongoose.model('UserGoals', userGoalSchema);

add = async (data) => {
    const goal = new UserGoal(data);
    await goal.save();
    return goal;
};

update = async (query, data) => {
    return UserGoal.findOneAndUpdate(query, data, { new: true });
};

find = async (query) => {
    return UserGoal.findOne(query);
};

getGoals = async (query, page, pageSize) => {
    return UserGoal.find(query)
        .sort({ _id: -1 })
        .skip(page)
        .limit(pageSize);
};

getActiveTypes = async () => {
    return UserGoal.find(e => e.status == statusEnum.active.value);
};

module.exports = {
    add,
    update,
    find,
    getGoals,
    getActiveTypes
}