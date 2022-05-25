const constants = {
    PLUS: '+',
    minQuantity: 5,
    initialSale: 0,
    EMAIL_CHECK: "bomaid.co.bw"
};

const messageEnums = {
    getChats: 'GET_CHATS', //get all messages
    groupChat: 'GROUP_CHAT', //receive group message
    userChat: 'USER_CHAT', // receive user message
    sendChat: 'SEND_CHAT', // send user chat
    sendGroupChat: 'SEND_GROUP_CHAT', //send group chat
    disconnect: 'disconnect'
};

const POINT_UNIT = 1250;

module.exports = {
    constants,
    messageEnums,
    POINT_UNIT
};