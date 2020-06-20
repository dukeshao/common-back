const { create } = require('../db')
const colName = 'user';
let arr = require("./users.json");

//data 可以是单个对象获取对象数组
async function assert(data) {
    let result;
    try {
        result = await create(colName, data);
        result = result.result
        // result = formatData({ data: result });
    } catch (err) {
        result = err
        // result = formatData({ status: 400, msg: err });
    }
    console.log("操作结果=>", result);
}

assert(arr)
