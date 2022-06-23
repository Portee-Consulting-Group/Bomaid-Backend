const { NullReferenceException, AlreadyExistsException } = require('../../errors/AppError');
const { status } = require('../common/status');
const UserModel = require('../models/EntityModels/userModel');
const ChatRoomModel = require('../models/EntityModels/chatRoomModel');
const MessageModel = require('../models/EntityModels/messageModel');
const messageEnums = require('../common/enum').getMessageEnums();
const SuccessResponse = require('../models/viewModels/responseModel');
const { sendChat, sendGroupChat, sendAllMessagees } = require('../services/messagingService');
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

        if (req.body.groupImage != undefined && req.body.groupImage !== '') {
            const uploadedImage = await clodinaryService.uploadGroupImage(req.body.groupImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        }

        let chatRoom = await ChatRoomModel.insert(req.body);
        let response = new SuccessResponse(chatRoom, "chat created");
        res.status(status.SUCCESS).json(response);
    } catch (error) {
        res.status(status.ERROR).json({ error: error.message });
    }
};

updateGroup = async (req, res) => {
    try {
        if (req.body.groupImage != undefined && req.body.groupImage !== '') {
            const uploadedImage = await clodinaryService.uploadGroupImage(req.body.groupImage);
            req.body.uploadUrl = uploadedImage.url;
            req.body.uploadId = uploadedImage.public_id;
        }

        let group = await ChatRoomModel.update({ _id: req.body.chatId }, body);
        if (group == null) throw new NullReferenceException("Group not found");
        let response = new SuccessResponse(group, "group uodated");
        res.status(status.SUCCESS).json(response);
    } catch (error) {
        res.status(status.ERROR).json({ error: error.message });
    }
}

addMember = async (req, res) => {
    try {
        let chat = await ChatRoomModel.findChatRoom({ _id: req.body.chatId });
        if (chat == null) throw new NullReferenceException("Chat not found");

        let members = req.body.members;

        for (const member of members) {
            let user = await UserModel.find({ _id: member });
            if (user == null) throw new NullReferenceException(`user with id ${member} not found`);

            let value = await chat.members.includes(member);
            if (value == true) {
                throw new AlreadyExistsException(`Member with id ${member} already added`);
            }
        }
        let allMembers = chat.members.concat(req.body.members);

        chat = await ChatRoomModel.update({ _id: req.body.chatId },
            {
                members: allMembers
            });
        let response = new SuccessResponse(chat, "group updated");
        res.status(status.SUCCESS).json(response);
    } catch (error) {
        res.status(status.ERROR).json({ error: error.message });
    }
}

removeMember = async (req, res) => {
    try {
        let chat = await ChatRoomModel.findChatRoom({ _id: req.body.chatId });
        if (chat == null) throw new NullReferenceException("Chat not found");

        let members = req.body.members;
        for (const member of members) {
            let index = chat.members.indexOf(member);
            chat.members.splice(index, 1)
        }
        let newMembers = chat.members

        chat = await ChatRoomModel.update({ _id: req.body.chatId },
            {
                members: newMembers
            });
        let response = new SuccessResponse(chat, "group updated");
        res.status(status.SUCCESS).json(response);
    } catch (error) {
        res.status(status.ERROR).json({ error: error.message });
    }
}

deleteGroup = async (req, res) => {
    try {
        await MessageModel.deleteChats({ chatId: req.params.chatId });
        await ChatRoomModel.deleteChat({ _id: req.params.chatId });
        res.status(status.SUCCESS).json("Group and messages deleted");
    } catch (error) {
        res.status(status.ERROR).json({ error: error.message });
    }
}

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

getUserChats = async (req, res) => {
    try {
        let chats = await ChatRoomModel.findAll({ members: req.params.userId });
        if (chats == null) chats = [];
        res.status(status.SUCCESS).json(chats);

    } catch (error) {
        res.status(status.ERROR).json({ error: error.message });
    }
}

sendGroupMessage = async (req, res) => {
    try {
        let group = await ChatRoomModel.findChatRoom({ _id: req.body.chatId });
        if (group == null) throw new NullReferenceException("Group not found")

        const result = await MessageModel.insert(req.body);
        sendGroupChat(result._doc);
        res.status(status.SUCCESS).json(result);
    } catch (error) {
        res.status(status.ERROR).json({ error: error.message });
    }
}

getMessages = async (req, res) => {
    try {
        let messages = await MessageModel.findAll({ chatId: req.params.chatId });
        sendAllMessagees(messages)
        res.status(status.SUCCESS).json(messages);
    } catch (error) {
        res.status(status.ERROR).json({ error: error.message });
    }
}

module.exports = {
    createGroup,
    sendMessage,
    sendGroupMessage,
    getMessages,
    getUserChats,
    updateGroup,
    addMember,
    removeMember,
    deleteGroup
};
