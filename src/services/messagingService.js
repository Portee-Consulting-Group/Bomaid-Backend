const { messageEnums } = require("../common/constants");
const { pusher } = require("../common/pusherInit");


sendChat = (data) => {
    pusher.trigger(process.env.PUSHER_SUBSCRIBE, messageEnums.sendChat, {
        chatId: data.chatId,
        senderId: data.senderId,
        message: data.message
    });
}
sendGroupChat = (data) => {
    pusher.trigger(process.env.PUSHER_SUBSCRIBE, messageEnums.sendGroupChat, {
        chatId: data.chatId,
        senderId: data.senderId,
        message: data.message
    });
}
sendAllMessagees = (data) => {
    pusher.trigger(process.env.PUSHER_SUBSCRIBE, messageEnums.getChats, data);

}


module.exports = {
    sendChat,
    sendGroupChat,
    sendAllMessagees
}