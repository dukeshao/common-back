const express = require('express');
const Router = express.Router();
const { find } = require('../../db')
const { formatData, md5, decrypt, date, checkParamsFormat } = require('../../utils');

const colName = 'user';


// 接口参数
/**
 * @param {String} id  用户 ID
 */
let keyArr = [
    { key: "id", value: "jshdjfss", required: true, regex: /^[a-zA-Z\d]+$/ },
]

Router.get('/:id', async (req, res) => {
    let { id } = req.params;
    let query = { _id: id }
    let result;

    keyArr[0].value = id;

    //参数格式校验 start
    let { resStr, allPass } = checkParamsFormat(keyArr);
    if (!allPass) {
        result = formatData({ status: 400, message: resStr });
        res.send(result);
        return false;
    }
    //参数格式校验 end

    try {
        //根据条件查询
        result = await find(colName, query);
        if (result && result.length > 0) {
            let user = result[0];
            delete (user.psw);
            result = formatData({ entity: user });
        } else {
            result = formatData({ status: 404, message: "未找到此用户" })
        }
    } catch (err) {
        result = formatData({ status: 400, message: err });
    }

    res.send(result);
})


module.exports = Router;