let user = {};

function sendMessage(userId, text, files, time){
    user = {
        userId,
        text,
        files,
        time
    };
}