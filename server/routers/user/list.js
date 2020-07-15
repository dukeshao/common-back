const express = require('express');
const Router = express.Router();
const { find } = require('../../db')
const { formatData, md5, decrypt, date, checkParamsFormat, formatList } = require('../../utils');

//数据库表名称
const colName = 'user';

// 接口参数
/**
 * @param {Number} pageSize 页码大小
 * @param {Number} pageNum 第几页,从1开始
 * @param {String} name 模糊搜索
 */
let keyArr = [
    { key: "pageSize", value: 10, required: true, regex: /^[\d]+$/ },
    { key: "pageNum", value: 1, required: true, regex: /^[\d]+$/ },
    { key: "name", value: "", type: "String" },
]

Router.get('/', async (req, res) => {
    let { pageSize, pageNum, name } = req.query;
    let result;

    keyArr[0]["value"] = pageSize;
    keyArr[1]["value"] = pageNum;
    keyArr[2]["value"] = name;

    //参数格式校验 start
    let { resStr, allPass } = checkParamsFormat(keyArr);
    if (!allPass) {
        result = formatData({ status: 400, message: resStr });
        res.send(result);
        return false;
    }
    //参数格式校验 end

    try {
        //获取所有用户列表
        result = await find(colName);
        let data = formatList(result, pageNum, pageSize, name)
        result = formatData({ entity: data });
    } catch (err) {
        result = formatData({ status: 400, message: err });
    }

    res.send(result);
})


module.exports = Router;