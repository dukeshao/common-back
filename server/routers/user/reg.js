const express = require('express');
const Router = express.Router();
const { create, find } = require('../../db')
const { formatData, md5, decrypt, date, checkParamsFormat } = require('../../utils');

const colName = 'user';


// 接口参数
/**
 * @param {String} username 页码大小
 */
let getKeyArr = [
    {
        key: "username", value: null, required: true,
        type: "String", regex: /^[a-zA-Z][a-zA-Z-_\d]{2,15}$/, length: [3, 16],
        rules: "以字母开头,仅支持大小写字母、中划线-、下划线_、数字,长度为3-16"
    },
]
let postKeyArr = [
    {
        key: "username", value: null, required: true,
        type: "String", regex: /^[a-zA-Z][a-zA-Z-_\d]{2,15}$/, length: [3, 16],
        rules: "以字母开头,仅支持大小写字母、中划线-、下划线_、数字,长度为3-16"
    },
    {
        key: "psw", value: null, required: true,
        type: "String", regex: /^[a-zA-Z][a-zA-Z-_\d]{5,15}$/, length: [6, 18],
        rules: "以字母开头,仅支持大小写字母、中划线-、下划线_、数字,长度为5-16"
    },
    {
        key: "nickname", value: null, required: true,
        type: "String", regex: /^[\u2E80-\u9FFF]{2,4}$/, length: [2, 4],
        rules: "昵称仅支持中文,长度为2-6"
    },
    {
        key: "phone", value: null, required: true,
        type: "String", regex: /^[\d]{11}$/, length: [11, 11],
        rules: "仅支持数字,长度为11"
    },
    {
        key: "email", value: null, required: true,
        type: "String", regex: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
        rules: "请输入正确的电子邮箱"
    }
]


//查询账号是否可注册?
Router.get('/', async (req, res) => {
    let { username } = req.query;
    getKeyArr[0].value = username;
    let result;

    //参数格式校验 start
    let { resStr, allPass } = checkParamsFormat(getKeyArr);
    if (!allPass) {
        result = formatData({ status: 400, message: resStr, entity: "" });
        res.send(result);
        return false;
    }
    //参数格式校验 end


    let data = { username };
    try {
        result = await find(colName, data);
        if (result.length > 0) {
            result = "exist";
            result = formatData({ entity: result });
        } else {
            result = "noexist";
            result = formatData({ entity: result });
        }
    } catch (err) {
        result = formatData({ status: 400, message: err });
    }

    res.send(result);
})

//注册 - - 写入用户信息username,psw
Router.post('/', async (req, res) => {
    let { username, psw, nickname, phone, email } = req.body;
    let createAt = date.formatDate(new Date());
    let updateAt = createAt;
    let result;

    // 后端解密
    // psw = decrypt(psw);
    // console.log('后端解密：', psw);

    postKeyArr[0].value = username;
    postKeyArr[1].value = psw;
    postKeyArr[2].value = nickname;
    postKeyArr[3].value = phone;
    postKeyArr[4].value = email;

    //参数格式校验 start
    let { resStr, allPass } = checkParamsFormat(postKeyArr);
    if (!allPass) {
        result = formatData({ status: 400, message: resStr, entity: "" });
        res.send(result);
        return false;
    }
    //参数格式校验 end


    // 利用md5加密密码
    // psw = md5(psw);
    // console.log('md5加密：', psw);

    let data = { username, psw, nickname, phone, email, createAt, updateAt };
    try {
        //账号已存在 处理
        let repeat = await find(colName, { username });
        if (repeat.length > 0) {
            result = formatData({ entity: false, message: "账号已被占用", success: false });
            res.send(result);
            return false;
        }
        //账号可注册 执行写入操作
        result = await create(colName, data);
        if (result.result.n === 1) {
            result = formatData({ entity: { username, nickname, phone, email, createAt, updateAt }, message: "注册成功" });
        } else {
            result = formatData({ entity: result, message: "注册失败,未知原因", success: false });
        }
    } catch (err) {
        result = formatData({ status: 400, message: err });
    }

    res.send(result);
})


module.exports = Router;