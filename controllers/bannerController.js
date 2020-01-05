const Sequelize = require('sequelize');
const { logger } = require('../middlewares/logging');
const Op = Sequelize.Op;
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ErrorHelper = require('../helpers/ErrorHelper');
const config = require('../config');
const { Banner } = require('../startup/db');

const show_current_banner = async (req, res) => {
  try {
    let banner = await Banner.findAll({
      limit: 1,
      order: [['createdAt', 'DESC']]
    });
    res.json(banner);
  } catch (error) {
    logger.error(error.message, error);
    res.status(400).json('Something went wrong.');
  }
};

module.exports = {
  show_current_banner
};
