const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();

const exerciseSchema = new Schema({
    name: { type: String, default: "" },
    bodyId: { type: [String], default: [] },
    uploadUrl: { type: String, default: "" },
    uploadId: { type: String, default: "" },
    status: { type: Number, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Exercise = mongoose.model('Exercises', exerciseSchema);

add = async (data) => {
    const exercise = new Exercise(data);
    await exercise.save();
    return exercise;
};

update = async (query, data) => {
    return Exercise.findOneAndUpdate(query, data, { new: true });
};

find = async (query) => {
    return Exercise.findOne(query);
};

findAll = async (query) => {
    return Exercise.find(query);
};

getStyles = async (query, page, pageSize) => {
    return Exercise.find(query)
        .sort({ createdAt: 'desc' })
        .skip(page)
        .limit(pageSize);
};

module.exports = {
    add,
    update,
    find,
    findAll,
    getStyles,
    Exercise
}