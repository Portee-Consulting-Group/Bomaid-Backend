const mongoose = require('mongoose');
const { User } = require('./userModel');
const { SwimStyle } = require('./swimStyleModel');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();

const feedSchema = new Schema({
    userId: { type: String, ref: User, required: true },
    styleId: { type: String, ref: SwimStyle, required: true },
    duration: {type: String, default: ""},
    laps: {type: Number, default: 0},
    speed: {type: Number, default: 0},
    poolSize: {type: Number, default: 0},
    calories: {type: Number, default: 0},
    heartRate: {type: Number, default: 0},
    pace: {type: String, default: 0},
    distance: {type: Number, default: 0},
    photoUrls: { type: [String], default: [] },
    status: { type: Number, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const SwimProgram = mongoose.model('SwimPrograms', feedSchema);


add = async (data) => {
    const program = new SwimProgram(data);
    await program.save();
    return program;
};

update = async (query, data) => {
    return SwimProgram.findOneAndUpdate(query, data, { new: true });
};

find = async (query) => {
    return SwimProgram.findOne(query);
};

findAll = async (query) => {
    return SwimProgram.find(query);
};

getPrograms = async (query, page, pageSize) => {
    return SwimProgram.find(query)
        .sort({ createdAt: 'desc' })
        .skip(page)
        .limit(pageSize);
};

module.exports = {
    add,
    update,
    find,
    findAll,
    getPrograms
}