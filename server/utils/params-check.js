/**
 * 对传入接口的参数做校验
 * 1、必传参数缺省 - 直接返回 错误处理
 * 2、参数格式不正确 - 直接返回 错误处理
 */

// keyArr - 接口参数
/**
 * @param {String} key 参数名称
 * @param {Any} value 参数值
 * @param {Boolean} required 参数是否必传
 * @param {String} type 参数类型
 * @param {Regex} regex 参数正则要求
 * @param {Array} length 参数长度
 * @param {String} rules 参数值的要求的中文说明
 * 
 */

//如果正则存在则校验 type,regex; 如果正则不存在则校验 type,length;
function checkParamsFormat(keyArr = []) {
    let resArr = [];
    let resStr = "";
    let allPass = true;
    keyArr.forEach(keyObj => {
        let resObj = {};
        if (keyObj.required) {
            if (keyObj.value === undefined || keyObj.value === null) {
                resObj.message = "参数" + keyObj.key + "为必传参数;"
                resStr += "参数" + keyObj.key + "为必传参数;"
                allPass = false;
                return { resArr, resStr, allPass };;
            } else {
                //校验逻辑
                checkTypeAndReg(keyObj);
            }
        } else {
            if (keyObj.value !== undefined && keyObj.value !== null) {
                //校验逻辑
                checkTypeAndReg(keyObj);
            }
        }

        function checkTypeAndReg(keyObj) {
            let res = { key: "", pass: true, message: "" };

            //检测数据类型
            let typePass = true;
            if (keyObj["type"]) {
                let type = Object.prototype.toString.apply(keyObj.value);
                type = type.split(" ")[1].slice(0, -1);
                typePass = keyObj.type == type ? true : false;
            }

            //优先检测 regex，其次 length；regex 和 length 都不传 则 只检测 type;
            let regexOrLengthPass = false;
            if (keyObj["regex"]) {
                regexOrLengthPass = keyObj["regex"].test(keyObj.value);
            } else if (keyObj["length"]) {
                regexOrLengthPass = keyObj.value.length >= keyObj["length"][0] && keyObj.value.length <= keyObj["length"][1];
            } else {
                regexOrLengthPass = true;
            }
            res.key = keyObj.key;
            res.pass = typePass && regexOrLengthPass;

            if (!regexOrLengthPass) {
                res.message = "参数" + keyObj.key + "的数据内容不合法;";
                if (keyObj.rules) {
                    res.message = "参数" + keyObj.key + "的数据内容不合法," + keyObj.rules + ";";
                }
                if (keyObj.rules) {
                    resStr += "参数" + keyObj.key + "的数据内容不合法," + keyObj.rules + ";";
                } else {
                    resStr += "参数" + keyObj.key + "的数据内容不合法;";
                }
                allPass = false;
            }
            if (!typePass) {
                res.message = "参数" + keyObj.key + "的数据类型应为" + keyObj["type"] + ";";
                resStr += "参数" + keyObj.key + "的数据类型应为" + keyObj["type"] + ";";
                allPass = false;
            }
            resArr.push(res);
        }
    })
    return { resArr, resStr, allPass };
}

module.exports = {
    checkParamsFormat,
}