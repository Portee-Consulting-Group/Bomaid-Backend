const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();

const pointSchema = new Schema({
    currentPoint: { type: Number, required: true },
    distanceCovered: { type: Number, required: true },
    userId: { type: String, required: true },
    goalTypeId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Point = mongoose.model('Points', pointSchema);


add = async (data) => {
    const type = new Point(data);
    await type.save();
    return type;
};

update = async (query, data) => {
    return Point.findOneAndUpdate(query, data, { new: true });
};

find = async (query) => {
    return Point.findOne(query);
};

getActiveTypes = async (page, pageSize) => {
    return Point.find({ status: statusEnum.active.value })
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