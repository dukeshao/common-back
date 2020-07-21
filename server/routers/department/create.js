const express = require('express');
const Router = express.Router();
const { create, find } = require('../../db')
const { formatData, md5, decrypt, date, checkParamsFormat } = require('../../utils');

const colName = 'department';


// 接口参数
/**
 * @param {String} username 页码大小
 */
let getKeyArr = [
    {
        key: "name", value: null, required: true,
        type: "String", regex: /^[\u2E80-\u9FFF]{2,4}$/, length: [2, 4],
        rules: "昵称仅支持中文,长度为2-4"
    },
]
let postKeyArr = [
    {
        key: "name", value: null, required: true,
        type: "String", regex: /^[\u2E80-\u9FFF]{2,4}$/, length: [2, 4],
        rules: "昵称仅支持中文,长度为2-4"
    },
    {
        key: "creatorId", value: null, required: true,
        type: "String", regex: /^[a-zA-Z-_\d]+$/,
        rules: "请输入正确的用户id"
    },
    {
        key: "description", value: null, required: true,
        type: "String", length: [0, 36],
        rules: "长度不得大于36"
    }
]


//查询部门名称?
Router.get('/', async (req, res) => {
    let { name } = req.query;
    getKeyArr[0].value = name;
    let result;

    //参数格式校验 start
    let { resStr, allPass } = checkParamsFormat(getKeyArr);
    if (!allPass) {
        result = formatData({ status: 400, message: resStr, entity: "" });
        res.send(result);
        return false;
    }
    //参数格式校验 end


    let data = { name };
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

//注册 - - 写入部门信息 name,creatorId,member,description,createAt,updateAt
Router.post('/', async (req, res) => {
    let { name, creatorId, description } = req.body;
    let member = [creatorId];
    let createAt = date.formatDate(new Date());
    let updateAt = createAt;
    let result;

    postKeyArr[0].value = name;
    postKeyArr[1].value = creatorId;
    postKeyArr[2].value = description;

    //参数格式校验 start
    let { resStr, allPass } = checkParamsFormat(postKeyArr);
    if (!allPass) {
        result = formatData({ status: 400, message: resStr, entity: "" });
        res.send(result);
        return false;
    }
    //参数格式校验 end


    let data = { name, creatorId, member, description, createAt, updateAt };
    try {
        //部门名称已存在 处理
        let repeat = await find(colName, { name });
        if (repeat.length > 0) {
            result = formatData({ entity: false, message: "部门名称已被占用", success: false, status: 400 });
            res.send(result);
            return false;
        }
        //可注册 执行写入操作
        result = await create(colName, data);
        if (result.result.n === 1) {
            result = formatData({ entity: { name, creatorId, member, description, createAt, updateAt }, message: "创建成功" });
        } else {
            result = formatData({ entity: result, message: "创建失败,未知原因", success: false, status: 400 });
        }
    } catch (err) {
        result = formatData({ status: 400, message: err });
    }

    res.send(result);
})


module.exports = Router;