const {io} = require('../../app');
const {messages} = require('../common/constants')

io.on('connection', socket=>{
    socket.on('connection', (data)=>{
        console.log('socket connection data', data);

    })

    //send message to client with that id
    //new messages will be sent here
    socket.on(messages.newChat, (data)=>{
        console.log('new message from user', data);

        //add files to clodinary if any and emit message back to client
        socket.broadcast.emit(messages.sendChat, {
            senderId,
            receiverId,
            chatId,
            files
        })

    })
})