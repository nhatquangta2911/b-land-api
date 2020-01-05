const Sequelize = require('sequelize');
const { logger } = require('../middlewares/logging');
const Op = Sequelize.Op;
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ErrorHelper = require('../helpers/ErrorHelper');
const config = require('../config');
const { ContentUI } = require('../startup/db');

const show_current_content_ui = async (req, res) => {
  try {
    let contentUI = await ContentUI.findAll({
      limit: 1,
      order: [['createdAt', 'DESC']]
    });
    res.json(contentUI);
  } catch (error) {
    logger.error(error.message, error);
    res.status(400).json('Something went wrong.');
  }
};

module.exports = {
  show_current_content_ui
};
