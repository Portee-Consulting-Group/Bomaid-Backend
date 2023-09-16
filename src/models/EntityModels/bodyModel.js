const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();

const BodySchema = new Schema({
    name: { type: String, default: "" },
    uploadUrl: { type: String, default: "" },
    uploadId: { type: String, default: "" },
    status: { type: Number, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Body = mongoose.model('Bodies', BodySchema);


add = async (data) => {
    const style = new Body(data);
    await style.save();
    return style;
};

update = async (query, data) => {
    return Body.findOneAndUpdate(query, data, { new: true });
};

find = async (query) => {
    return Body.findOne(query);
};

findAll = async (query) => {
    return Body.find(query);
};

getBody = async (query, page, pageSize) => {
    return Body.find(query)
        .sort({ createdAt: 'desc' })
        .skip(page)
        .limit(pageSize);
};

module.exports = {
    add,
    update,
    find,
    findAll,
    getBody,
    Body
}