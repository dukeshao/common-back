var http = require('http');
const express = require('express');
// var sio = require('socket.io');
const app = express();
const routers = require('./routers');


const { formatData, Jwt } = require('./utils');



//设置跨域访问
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    // res.header("Content-Type", "*");
    next();
});

//拦截所有请求 校验 token
// app.use(function (req, res, next) {
//     let url = req.url.split("?")[0];
//     if (url != '/user/login' && url != '/user/reg') {
//         let token = req.headers.token;
//         console.log("req.headers.token=>", token);
//         let verifyRes = new Jwt(token).checkExpire();
//         let result;
//         // 校验通过就next，否则就返回登陆信息不正确
//         if (verifyRes == 'err') {
//             result = formatData({ status: 403, message: '登录已过期,请重新登录' })
//             res.send(result);
//         } else if (verifyRes == 'next') {
//             next();
//         } else {
//             req.headers.newToken = verifyRes;
//             next();
//         }
//     } else {
//         next();
//     }
// })


// app.use(express.static('./src'));
app.use(routers);

const { PORT } = require('./config.json');
app.listen(PORT, () => {
    console.log("server start on port %s", PORT);
})

// var server = http.createServer(app);
// server.listen(PORT, '127.0.0.1');
// var io = sio.listen(server);
// var users = [];
// io.sockets.on('connection', function (socket) {
//     console.log('a socket is connect, id: ' + socket.id);
//     io.sockets.emit('conn', socket.id);
// });
// setInterval(function () {
    // console.log('推送消息');
//     io.sockets.emit('conn', '推送消息');
// }, 1000);