const Sequelize = require('sequelize');
const { logger } = require('../middlewares/logging');
const Op = Sequelize.Op;
const bcrypt = require('bcryptjs');
const ErrorHelper = require('../helpers/ErrorHelper');
const config = require('../config');
const { User } = require('../startup/db');

const show_all_users = async (req, res) => {
  try {
    let users = await User.findAll();
    res.json({ users, total: users.length });
  } catch (error) {
    logger.error(error.message, error);
    res.status(400).json('Something went wrong.');
  }
};

module.exports = {
  show_all_users
};
