const Sequelize = require('sequelize');
const { logger } = require('../middlewares/logging');
const Op = Sequelize.Op;
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ErrorHelper = require('../helpers/ErrorHelper');
const config = require('../config');
const {
  Product,
  ProductDiscount,
  ProductPricing,
  ProductType,
  ProductStatus
} = require('../startup/db');

const show_all_products = async (req, res) => {
  try {
    let products = await Product.findAll({
      include: [ProductStatus, ProductPricing, ProductDiscount, ProductType]
    });
    res.json({ products, total: products.length });
  } catch (error) {
    logger.error(error.message, error);
    res.status(400).json('Something went wrong.');
  }
};

module.exports = {
  show_all_products
};
