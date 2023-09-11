const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();

const swimStyleSchema = new Schema({
    name: { type: String, default: "" },
    uploadUrl: { type: String, default: "" },
    uploadId: { type: String, default: "" },
    status: { type: Number, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const SwimStyle = mongoose.model('SwimStyles', swimStyleSchema);


add = async (data) => {
    const style = new SwimStyle(data);
    await style.save();
    return style;
};

update = async (query, data) => {
    return SwimStyle.findOneAndUpdate(query, data, { new: true });
};

find = async (query) => {
    return SwimStyle.findOne(query);
};

findAll = async (query) => {
    return SwimStyle.find(query);
};

getStyles = async (query, page, pageSize) => {
    return SwimStyle.find(query)
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
    SwimStyle
}