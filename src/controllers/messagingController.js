const { NullReferenceException, AlreadyExistsException } = require('../../errors/AppError');
const { status } = require('../common/status');
const UserModel = require('../models/EntityModels/userModel');
const ChatRoomModel = require('../models/EntityModels/chatRoomModel');
const MessageModel = require('../models/EntityModels/messageModel');
const messageEnums = require('../common/enum').getMessageEnums();
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');
const app = require("../../app");
const { sendChat, sendGroupChat } = require('../services/messagingService');

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

sendMessage = async (req, res) => {
    try {
        let chat;
        let result;
        if (req.body.chatId == '' || req.body.chatId == undefined) {
            for (let user of req.body.members) {
                user = await UserModel.find({ _id: user });
                if (user == null) throw new NullReferenceException("User not found");
            }
            chat = await ChatRoomModel.insert({
                members: req.body.members,
                type: messageEnums.chat.value
            });
            if (chat != null) {
                result = await MessageModel.insert({
                    chatId: chat._id,
                    senderId: req.body.senderId,
                    message: req.body.message
                });
            }
        } else {
            chat = await ChatRoomModel.findChatRoom({ _id: req.body.chatId });
            if (chat == null) throw new NullReferenceException("Chat room not found");
            result = await MessageModel.insert({
                chatId: req.body.chatId,
                senderId: req.body.senderId,
                message: req.body.message
            });
        }
        sendChat(result._doc);
        res.status(status.SUCCESS).json(result._doc);
    } catch (error) {
        res.status(status.ERROR).json({ error: error.message });
    }
};

sendGroupMessage = async (req, res) => {
    try {
        let group = await ChatRoomModel.findChatRoom({ _id: req.body.chatId });
        if (group == null) throw new NullReferenceException("Group not found")

        const result = await MessageModel.insert(req.body);
        sendGroupChat(result._doc);
        res.status(status.SUCCESS).json(result);
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
