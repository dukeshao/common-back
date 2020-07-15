/**
 * 格式化时间
 */

exports.formatDate = (params = new Date()) => {
    let date = new Date(params);
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();

    month = month.toString().length == 1 ? "0" + month : month;
    day = day.toString().length == 1 ? "0" + day : day;

    let res = `${year}年${month}月${day}日`;

    return res;
}
