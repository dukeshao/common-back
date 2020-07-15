const express = require('express');
const Router = express.Router();
const { find, update, create } = require('../../db')
const { md5, encrypt, decrypt, formatData, Jwt } = require('../../utils');

const colName = "user";


//用户注册提交数据,写入数据库
Router.post('/', async (req, res) => {
    let { username, psw } = req.query;

    // 后端解密
    // psw = decrypt(psw);

    // console.log('后端解密：', psw);

    // 利用md5加密密码
    // psw = md5(psw);

    // console.log('md5加密：', psw);

    let data = { username, psw }
    // console.log("postdata:", data);
    let result;
    try {
        result = await find(colName, data);
        // update("now", { id: 1 }, { username })
        // create("now",{username,id:1})
        // console.log("result1=>", result)
        if (result.length === 1) {
            result = result[0];
            let jwt = new Jwt(result);
            let token = jwt.generateToken();
            delete (result.psw);
            delete (result._id);
            result = formatData({ entity: result });
            result.token = token;
        } else {
            result = formatData({ status: 403, msg: "账号信息异常!" });
        }
    } catch (err) {
        result = formatData({ status: 400, msg: err });
    }

    res.send(result);
})

module.exports = Router;