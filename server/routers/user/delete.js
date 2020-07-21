const express = require('express');
const Router = express.Router();
const { deletes } = require('../../db')
const { formatData, md5, decrypt, date, checkParamsFormat } = require('../../utils');

const colName = 'user';

// 接口参数
/**
 * @param {Array} ids 字符串一维数组，用字符串拼接去校验数据格式
 */
let keyArr = [
    { key: "ids", value: [""], required: true, regex: /^[a-zA-Z;\d]+$/, rules: "请传入正确的用户id" },
]

//删除用户 根据 _id
Router.delete('/', async (req, res) => {
    let { ids } = req.body;
    let data = { _id: ids }
    let result;
    keyArr[0].value = ids.join(";");

    //参数格式校验 start
    let { resStr, allPass } = checkParamsFormat(keyArr);
    if (!allPass) {
        result = formatData({ status: 400, message: resStr });
        res.send(result);
        return false;
    }
    //参数格式校验 end

    try {
        result = await deletes(colName, data);
        if (result && result.result.ok) {
            if (result.result.n == 0) {
                result = formatData({ message: "无可操作用户" });
            } else {
                result = formatData({ message: "操作成功" });
            }
        } else {
            result = formatData({ status: 400, message: "操作异常", entity: result });
        }
    } catch (err) {
        result = formatData({ status: 400, message: err });
    }

    res.send(result);
})


module.exports = Router;