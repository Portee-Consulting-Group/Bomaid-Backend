const { NullReferenceException, AlreadyExistsException } = require('../../errors/AppError');
const { status } = require('../common/status');
const UserModel = require('../models/EntityModels/userModel');
const ChatRoomModel = require('../models/EntityModels/chatRoomModel');
const messageEnums = require('../common/enum').getMessageEnums();
const SuccessResponse = require('../models/viewModels/responseModel');
const clodinaryService = require('../services/CloudinaryService');

createGroup = async (req, res) => {
    try {
        for (let user of req.body.userId) {
            user = await UserModel.find({ _id: user });
            if (user == null) {
                throw new NullReferenceException("User not found");
            }
        }
        req.body.type = messageEnums.group.value;
        let chatRoom = await ChatRoomModel.insert(req.body);
        let response = new SuccessResponse(chatRoom, "chat group created");
        res.status(status.SUCCESS).json(response);
    } catch (error) {
        res.status(status.ERROR).json({ error: error.message });
    }
};

sendMessage = async (req, res) => {
    try {
        let chat;
        if (req.body.chatId == '' || req.body.chatId == undefined) {
            let senderId = await UserModel.find({ _id: req.body.senderId });
            if (senderId == null) throw new NullReferenceException("User not found");
            let receiverId = await UserModel.find({ _id: req.body.receiverId });
            if (receiverId == null) throw new NullReferenceException("User not found");

            let firstCase = await ChatRoomModel.findChatRoom({ senderId: req.body.senderId, receiverId: req.body.receiverId });
            let secondCase = await ChatRoomModel.findChatRoom({ receiverId: req.body.senderId, senderId: req.body.receiverId });
            let chatroom;
            if (firstCase == null || secondCase == null) {
                req.body.type = messageEnums.message.value;
                chatroom = await ChatRoomModel.insert(req.body);
            }
        } else {
            chat = await ChatRoomModel.findChatRoom({ _id: req.body.chatId });
            if (chat == null) {
                throw new NullReferenceException("Chat room not found");
            }
        }
        let filesUrl = []
        for (const iterator of object) {
            if (iterator != undefined) {
                const uploadedImage = await clodinaryService.uploadChallengeImage(iterator);
                filesUrl.push({
                    uploadUrl: uploadedImage.url,
                    uploadId: uploadedImage.public_id
                });
            }
        }
        //push to socket.io for frontend
        // let chatRoom = await ChatRoomModel.insert(req.body);
        let response = new SuccessResponse(chatRoom, "chat created");
        res.status(status.SUCCESS).json(response);
    } catch (error) {
        res.status(status.ERROR).json({ error: error.message });
    }
};

module.exports = {
    createGroup,
    sendMessage
};
