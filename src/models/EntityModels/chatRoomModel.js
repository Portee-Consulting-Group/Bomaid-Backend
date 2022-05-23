const mongoose = require('mongoose');
const { NotFoundException } = require('../../../errors/AppError');
const Schema = mongoose.Schema;
const statusEnum = require('../../common/enum').getStatusEnum();


const chatRoomSchema = new Schema({
    title: { type: String },
    members: [{ type: String }],
    adminId: {type: String },
    type: {type: Number, required: true},
    status: { type: Number, required: true, default: statusEnum.active.value },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const ChatRoom = mongoose.model('ChatRooms', chatRoomSchema);

insert = (data) => {
    const chat = new ChatRoom(data);
    chat.save();
    return chat;
};

findChatRoom = async (query) => {
    const value = await ChatRoom.findOne(query);
    if (value == null) {
        return null;
    }
    return value;
};

findAll = async (query) => {
    const value = await ChatRoom.find(query);
    if (value == null) {
        return null;
    }
    return value;
};

getAllChatRooms = async (query, page, pageSize) => {
    return ChatRoom.find(query)
        .sort({ _id: -1 })
        .skip(page)
        .limit(pageSize);
};

update = async (query, data) => {
    return ChatRoom.findOneAndUpdate(query, data, { new: true });
};



module.exports = {
    insert,
    findAll,
    findChatRoom,
    update,
    getAllChatRooms
};