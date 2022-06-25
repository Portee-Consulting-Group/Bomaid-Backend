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

const POINT_UNIT = 4000;
const DEFAULT_PIC_URL = "http://res.cloudinary.com/mizi/image/upload/v1655820079/bomaid_profile_images/lcmisldquoglczmg7in8.jpg";
const DEFAULT_PIC_ID = "bomaid_profile_images/lcmisldquoglczmg7in8";

module.exports = {
    constants,
    messageEnums,
    POINT_UNIT,
    DEFAULT_PIC_URL,
    DEFAULT_PIC_ID
};