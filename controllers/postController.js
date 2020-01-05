const Sequelize = require('sequelize');
const { logger } = require('../middlewares/logging');
const Op = Sequelize.Op;
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ErrorHelper = require('../helpers/ErrorHelper');
const config = require('../config');
const { Post, Account } = require('../startup/db');

const show_all_posts = async (req, res) => {
  try {
    let posts = await Account.findAll({
      include: [Post]
    });
    res.json({ posts, total: posts.length });
  } catch (error) {
    logger.error(error.message, error);
    res.status(400).json('Something went wrong.');
  }
};

module.exports = {
  show_all_posts
};
