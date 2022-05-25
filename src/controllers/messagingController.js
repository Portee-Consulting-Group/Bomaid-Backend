const { NullReferenceException, AlreadyExistsException } = require('../../errors/AppError');
const { status } = require('../common/status');
const UserModel = require('../models/EntityModels/userModel');
const ChatRoomModel = require('../models/EntityModels/chatRoomModel');
const MessageModel = require('../models/EntityModels/messageModel');
const messageEnums = require('../common/enum').getMessageEnums();
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');

createGroup = async (req, res) => {
    try {
        let admin = await UserModel.find({ _id: req.body.adminId });
        if (admin == null) {
            throw new NullReferenceException("User not found");
        }
        for (let user of req.body.members) {
            user = await UserModel.find({ _id: user });
            if (user == null) {
                throw new NullReferenceException("User not found");
            }
        }
        req.body.type = messageEnums.group.value;
        let chatRoom = await ChatRoomModel.insert(req.body);
        let response = new SuccessResponse(chatRoom, "chat created");
        res.status(status.SUCCESS).json(response);
    } catch (error) {
        // res.status(status.ERROR).json({ error: error.message });
    }
};

sendMessage = async (data) => {
    try {
        let chat;
        if (data.chatId == '' || data.chatId == undefined) {
            for (let user of data.members) {
                user = await UserModel.find({ _id: user });
                if (user == null) throw new NullReferenceException("User not found");
            }
            chat = await ChatRoomModel.insert({
                members: data.members,
                type: messageEnums.chat.value
            });
            if (chat._id != null) {
                const result = await MessageModel.insert({
                    chatId: chat._id,
                    senderId: data.senderId,
                    message: data.message
                });
                return result;
            }
        } else {
            chat = await ChatRoomModel.findChatRoom({ _id: data.chatId });
            if (chat == null) throw new NullReferenceException("Chat room not found");
            const result = await MessageModel.insert({
                chatId: chat._id,
                senderId: data.senderId,
                message: data.message
            });
            return result;
        }
    } catch (error) {
        // res.status(status.ERROR).json({ error: error.message });
    }
};

sendGroupMessage = async (data) => {
    try {
        let group = await ChatRoomModel.findChatRoom({ _id: data.chatId });
        if (group == null) throw new NullReferenceException("Group not found")

        const result = await MessageModel.insert(data);
        return result;
    } catch (error) {
        // res.status(status.ERROR).json({ error: error.message });
    }
}

getMessages = async (data) => {
    let messages = await MessageModel.findAll({ chatId: data })
    return messages;
}

module.exports = {
    createGroup,
    sendMessage,
    sendGroupMessage,
    getMessages
};
