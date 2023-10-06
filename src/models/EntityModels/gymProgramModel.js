const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();

const gymProgramSchema = new Schema({
    duration: {type: String, default: ""},
    calories: {type: String, default: 0},
    photoUrls: { type: [String], default: [] },
    programData: { type: [], default: [] },
    userId: { type: String, required: true },
    status: { type: Number, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const GymProgram = mongoose.model('GymPrograms', gymProgramSchema);


add = async (data) => {
    const gymProgram = new GymProgram(data);
    await gymProgram.save();
    return gymProgram;
};

update = async (query, data) => {
    return GymProgram.findOneAndUpdate(query, data, { new: true });
};

find = async (query) => {
    return GymProgram.findOne(query);
};

findAll = async (query) => {
    return GymProgram.find(query);
};

getGymPrograms = async (query, page, pageSize) => {
    return GymProgram.find(query)
        .sort({ createdAt: 'desc' })
        .skip(page)
        .limit(pageSize);
};

module.exports = {
    add,
    update,
    find,
    findAll,
    getGymPrograms
}