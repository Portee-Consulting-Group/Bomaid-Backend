const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();

const messageSchema = new Schema({
    chatId: {type: String},
    senderId: {type: String},
    message: {type: String, required: true},
    defaultMsg: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Messages', messageSchema);


insert = (data) => {
    const message = new Message(data);
    message.save();
    return message;
};

findChatMessages = async (query) => {
    const value = await Message.findOne(query);
    if (value == null) {
        return null;
    }
    return value;
};

findAll = async (query) => {
    const value = await Message.find(query);
    if (value == null) {
        return null;
    }
    return value;
};

getAllChatMessages = async (query, page, pageSize) => {
    return Message.find(query)
        .sort({ _id: -1 })
        .skip(page)
        .limit(pageSize);
};

update = async (query, data) => {
    return Message.findOneAndUpdate(query, data, { new: true });
};

deleteChats = async (query) => {
    let result = await Message.deleteMany(query)
    return result;
}



module.exports = {
    insert,
    findAll,
    findChatMessages,
    update,
    getAllChatMessages,
    deleteChats
};