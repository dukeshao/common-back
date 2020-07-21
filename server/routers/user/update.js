const express = require('express');
const Router = express.Router();
const { update } = require('../../db')
const { formatData, checkParamsFormat } = require('../../utils');

const colName = 'user';

// 接口参数
/**
 * @param {String} nickname 用户昵称
 * @param {String} phone 用户手机号
 * @param {String} email 用户邮箱地址
 */
let keyArr = [
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

//修改用户信息 根据 _id  (nickname,email,phone)
Router.post('/:id', async (req, res) => {
    let { id } = req.params;
    let { nickname, phone, email } = req.body;
    let query = { _id: id };
    let data = { nickname, phone, email };
    let result;

    keyArr[0].value = nickname;
    keyArr[1].value = phone;
    keyArr[2].value = email;

    //参数格式校验 start
    let { resStr, allPass } = checkParamsFormat(keyArr);
    if (!allPass) {
        result = formatData({ status: 400, message: resStr });
        res.send(result);
        return false;
    }
    //参数格式校验 end

    try {
        result = await update(colName, query, data);
        if (result && result.result.ok) {
            if (result.matchedCount == 0) {
                result = formatData({ status: 400, message: "无此用户", entity: result });
            } else if (result.matchedCount == 1) {
                if (result.modifiedCount == 0) {
                    result = formatData({ status: 400, message: "数据库信息无需更改", entity: result });
                } else {
                    result = formatData({ message: "操作成功", entity: result });
                }
            } else {
                result = formatData({ status: 400, message: "匹配到多个用户，更改终止，建议使用id匹配单个用户", entity: result });
            }
        } else {
            result = formatData({ status: 400, message: "操作异常", entity: result });
        }
    } catch (err) {
        result = formatData({ status: 400, message: err, entity: result });
    }

    res.send(result);
})


module.exports = Router;