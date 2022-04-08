const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const fitSchema = new Schema({
    fitValue: { type: Number, required: true },
    calories: { type: Number, default: 0 },
    bpm: { type: Number, default: 0 },
    elavation: { type: Number, default: 0 },
    avgPace: { type: Number, default: 0 },
    goalTypeId: { type: String, required: true },
    userId: { type: String, required: true },
    statistic: { type: Number, default: 1, required: true },
    startLong: { type: Number, default: 0 },
    endLong: { type: Number, default: 0 },
    startLat: { type: Number, default: 0 },
    endLat: { type: Number, default: 0 },
    uploadUrl: { type: String, default: "" },
    uploadId: { type: String, default: "" },
    duration: {type: String, default: ""},
    status: { type: Number, required: true, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Fit = mongoose.model('Fits', fitSchema);

insert = (fitData) => {
    const fit = new Fit(fitData);
    fit.save();
    return fit;
};

findFit = async (query) => {
    const value = await Fit.findOne(query);
    if (value == null) {
        return null;
    }
    return value;
};

findAll = async (query) => {
    const value = await Fit.find(query);
    if (value == null) {
        return [];
    }
    return value;
}

getAllFits = async (query, page, pageSize) => {
    return Fit.find(query)
        .sort({ _id: -1 })
        .skip(page)
        .limit(pageSize);
};

update = async (query, fitData) => {
    return Fit.findOneAndUpdate(query, fitData, { new: true });
};



module.exports = {
    insert,
    findFit,
    findAll,
    update,
    getAllFits
};