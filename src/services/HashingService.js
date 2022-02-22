var cryproJs = require("crypto-js");
const secret = process.env.SECRET;

const encrypt = (data) => {
    let encrypted = cryproJs.AES.encrypt(data, secret).toString();
    let b64 = cryproJs.enc.Base64.parse(encrypted);
    encrypted = b64.toString(cryproJs.enc.Hex);
    return encrypted;
};

const decrypt = (encryptedData) => {
    let data;
    try {
        let b64 = cryproJs.enc.Hex.parse(encryptedData);
        let bytes = b64.toString(cryproJs.enc.Base64);
        data = cryproJs.AES.decrypt(bytes, secret);
        data = data.toString(cryproJs.enc.Utf8);
    } catch (err) {
        console.log('Error decrypting data: ' + err);
        throw new Error(err);
    }
    return data;
};

module.exports = {
    encrypt,
    decrypt
};