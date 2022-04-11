const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const circleSchema = new Schema({
    title: { type: String, required: true, lowercase: true},
    description: { type: String, required: true },
    adminId: { type: String, required: true },
    members: [{type: String}],
    theme: { type: String, default: "" },
    uploadUrl: { type: String, default: "" },
    uploadId: { type: String, default: "" },
    status: { type: Number, required: true, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Circle = mongoose.model('Circles', circleSchema);

insert = (circleData) => {
    const circle = new Circle(circleData);
    circle.save();
    return circle;
};

findCircle = async (query) => {
    const circleValue = await Circle.findOne(query);
    if (circleValue == null) {
        return null;
    }
    return circleValue;
};

getAllCircles = async (query, page, pageSize) => {
    return Circle.find(query)
        .sort({ _id: -1 })
        .skip(page)
        .limit(pageSize);
};

update = async (query, circleData) => {
    return Circle.findOneAndUpdate(query, circleData, { new: true });
};



module.exports = {
    insert,
    findCircle,
    update,
    getAllCircles
};