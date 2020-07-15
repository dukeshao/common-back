const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

/**
 * {
 * }
 */
// let jwt = {
//     decode: function () {

//     },
//     verify: function () {

//     },
//     sign: function () {

//     },
//     JsonWebTokenError: function () {

//     },
//     NotBeforeError: function () {

//     },
//     TokenExpiredError: function () {

//     },

// }

// 创建 token 类
class Jwt {
    constructor(data) {
        this.data = data;
    }

    //生成token
    generateToken() {
        let data = this.data;
        let cert = fs.readFileSync(path.join(__dirname, '../rsa_key/rsa_private_key.pem'));//私钥 可以自己生成;
        let token = jwt.sign({
            data,
        }, cert, { algorithm: 'RS256', expiresIn: '3h' });
        return token;
    }

    // 校验token
    verifyToken() {
        let token = this.data;
        let cert = fs.readFileSync(path.join(__dirname, '../rsa_key/rsa_public_key.pem'));//公钥 可以自己生成
        let res;
        try {
            let result = jwt.verify(token, cert, { algorithms: ['RS256'] }) || {};
            let { exp = 0 } = result;
            let current = Math.floor(Date.now() / 1000);
            if (current <= exp) {
                res = result.data || {};
            }
        } catch (e) {
            res = 'err';
        }
        return res;
    }
    // 校验token
    checkExpire() {
        let token = this.data;
        let cert = fs.readFileSync(path.join(__dirname, '../rsa_key/rsa_public_key.pem'));//公钥 可以自己生成
        let res;
        try {
            let result = jwt.verify(token, cert, { algorithms: ['RS256'] }) || {};
            let { exp = 0 } = result;
            let current = Math.floor(Date.now() / 1000);
            let twoHour = 60 * 60 * 3;
            let diff = exp - current;
            // console.log("diff=>", diff)
            if (0 < diff && diff < twoHour) {//刷新 token
                let user = result.data;
                let privateCert = fs.readFileSync(path.join(__dirname, '../rsa_key/rsa_private_key.pem'));//私钥 可以自己生成;
                res = jwt.sign({ user, }, privateCert, { algorithm: 'RS256', expiresIn: '3h' });
            } else if (diff >= twoHour) {//token未过期，且无需刷新
                res = 'next';
            }
        } catch (e) {
            res = 'err';
        }
        return res;
    }
}

module.exports = Jwt;
