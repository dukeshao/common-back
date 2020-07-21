const express = require('express');
const Router = express.Router();

const createRouter = require('./create');

Router.use('/create', createRouter);

module.exports = Router;