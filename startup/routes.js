/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-vars */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const home = require('../routes/home');
const account = require('../routes/accounts');
const post = require('../routes/posts');
const contentUI = require('../routes/contentUIs');
const banner = require('../routes/banners');
const error = require('../middlewares/error');
const fileUpload = require('express-fileupload');

module.exports = app => {
  app.use(fileUpload({ createParentPath: true }));
  app.use(cors({ origin: '*', credentials: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(morgan('tiny'));
  app.use(cookieParser());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, x-access-token'
    );
    next();
  });

  app.use('/', home);
  app.use('/api/accounts', account);
  app.use('/api/posts', post);
  app.use('/api/banners', banner);
  app.use('/api/contentUIs', contentUI);

  app.use(error);
};
