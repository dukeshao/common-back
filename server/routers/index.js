const express = require('express');
const Router = express.Router();

const userRouter = require('./user');

//处理前端请求,格式化数据
Router.use(express.json(), express.urlencoded({ extended: false }));


Router.use('/user', userRouter);

module.exports = Router;