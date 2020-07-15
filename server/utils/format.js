//格式化数据

//统一格式化返回体
function formatData({ entity = {}, message = "", status = 200, success = true } = {}) {
    if (status == 400) {
        success = false;
    }
    return {
        entity,
        message,
        status,
        success
    }
}

// 格式化列表接口 - 分页(arr, pageNum, pageSize, name);不分页(arr, name)
function formatList(arr, pageNum, pageSize, name) {
    let res = {};
    if (name) {
        arr = arr.filter(m => m.nickname.indexOf(name) > -1 || m.username.indexOf(name) > -1);
    }
    if (!pageNum && !pageSize) {
        res.entity = arr;
        return res;
    }
    res.list = arr.slice((pageNum - 1) * pageSize, pageNum * pageSize, pageSize);
    //数据总长度
    res.total = arr.length;
    //第几页
    res.pageNum = pageNum * 1;
    //每页长度
    res.pageSize = pageSize * 1;
    //总页数
    res.pages = Math.ceil(res.total / pageSize);
    return res;
}

module.exports = {
    formatData,
    formatList
}
