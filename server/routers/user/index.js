const express = require('express');
const Router = express.Router();

// const listRouter = require('./list');
// const detailRouter = require('./detail');
const regRouter = require('./reg');
const loginRouter = require('./login');
const deleteRouter = require('./delete');
const listRouter = require('./list');
const detailRouter = require('./detail');
const updateRouter = require('./update');
// const uploadRouter = require('./upload');

// Router.use('/list', listRouter);
// Router.use('/detail', detailRouter);
Router.use('/reg', regRouter);
Router.use('/login', loginRouter);
Router.use('/delete', deleteRouter);
Router.use('/list', listRouter);
Router.use('/', detailRouter);
Router.use('/update', updateRouter);
// Router.use('/upload', uploadRouter);

module.exports = Router;