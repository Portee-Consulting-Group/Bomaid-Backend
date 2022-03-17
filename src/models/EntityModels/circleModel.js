const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const circleSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Number, required: true, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now},
    updatedAt: { type: Date, default: Date.now}
});

const Circle = mongoose.model('Circles', circleSchema);

insert = (circleData) => {
    const circle = new Circle(circleData);
    circle.save();
    return circle;
};

findCode = async (query) => {
    const circleValue = await Circle.findOne(query);
    if (circleValue == null) {
        return null;
    }
    return circleValue;
};

getAllCircles = async (query) => {
    const circles = await Circle.find(query);
    return circles;
}

update = async (query, circleData) => {
    return Circle.findOneAndUpdate(query, circleData, { new: true });
};

module.exports = {
    insert,
    findCode,
    update,
    getAllCircles
}