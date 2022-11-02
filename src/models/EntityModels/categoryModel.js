const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const categorySchema = new Schema({
    name: { type: String, required: true },
    type: { type: Number, required: true, unique: true },
    status: { type: Number, required: true, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Category = mongoose.model('Category', categorySchema);

insert = (data) => {
    const level = new Category(data);
    level.save();
    return level;
};

insertMany = async (data) => {
    let allCategories = await getAllCategories();
    if (allCategories.length == 0) {
        const response = await Category.insertMany(data);
    }
}

findLevel = async (query) => {
    const value = await Category.findOne(query);
    if (value == null) {
        return null;
    }
    return value;
};

getAllCategories = async (query) => {
    const levels = await Category.find(query);
    return levels;
}


update = async (query, data) => {
    return Category.findOneAndUpdate(query, data, { new: true });
};

module.exports = {
    insert,
    insertMany,
    findLevel,
    update,
    getAllCategories
}