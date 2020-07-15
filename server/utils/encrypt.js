const crypto = require('crypto');
const { key, iv } = require('../config.json');


// AES加密解密
// crypto.createCipheriv(algorithm, key, iv[, options])
function encrypt(data, { type = 'aes-128-cbc', outType = 'base64', encode = 'utf8' } = {}) {
    const cipher = crypto.createCipheriv(type, key, iv);
    cipher.setAutoPadding(true);
    var crypted = cipher.update(data, encode, outType);
    crypted = cipher.final(outType);
    return crypted;
}
// 解密
// crypto.createDecipheriv(algorithm, key, iv[, options])
function decrypt(encrypted, { type = 'aes-128-cbc', inputEncoding = 'base64', outputEncoding = 'utf8' } = {}) {
    try {
        const decipher = crypto.createDecipheriv(type, key, iv);
        var decrypted = decipher.update(encrypted, inputEncoding, outputEncoding);
        decrypted = decipher.final(outputEncoding);
        return decrypted;
    } catch (err) {
        return err;
    }
}

// 利用md5加密密码
function md5(data, { inputEncoding = "utf8", encoding = "hex" } = {}) {
    const hash = crypto.createHash('md5');

    return hash.update(data, inputEncoding).digest(encoding);
}


module.exports = {
    md5,
    encrypt,
    decrypt,
}