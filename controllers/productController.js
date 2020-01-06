const Sequelize = require('sequelize');
const { logger } = require('../middlewares/logging');
const Op = Sequelize.Op;
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const ErrorHelper = require('../helpers/ErrorHelper');
const { uploadMulti } = require('../helpers/UploadToS3Helper');
const config = require('../config');
const {
  Product,
  ProductDiscount,
  ProductPricing,
  ProductType,
  ProductStatus,
  Account
} = require('../startup/db');

const show_all_products = async (req, res) => {
  try {
    let products = await Product.findAll({
      include: [
        Account,
        ProductStatus,
        ProductPricing,
        ProductDiscount,
        ProductType
      ]
    });
    res.json({ products, total: products.length });
  } catch (error) {
    logger.error(error.message, error);
    res.status(400).json('Something went wrong.');
  }
};

const show_products_by_page = async (req, res) => {
  try {
    if (req.params.page <= 0)
      return ErrorHelper.BadRequest(
        res,
        'Page number must be greater than zero'
      );
    let products = await Product.findAll({
      include: [
        Account,
        ProductStatus,
        ProductPricing,
        ProductDiscount,
        ProductType
      ],
      limit: 5,
      offset: (req.params.page - 1) * 5
    });
    res.json({ products, total: products.length });
  } catch (error) {
    logger.error(error.message, error);
    res.status(400).json('Something went wrong.');
  }
};

const add_product = async (req, res) => {
  try {
    const accountId = req.headers['id'];
    const account = await Account.findOne({ where: { id: accountId } });
    if (!account) return ErrorHelper.BadRequest(res, 'Account not found');

    const files = req.files.images;
    let uploadedFiles = [];

    for (let file of files) {
      uploadedFiles.push(await uploadMulti(file));
    }

    let product = await Product.create({
      ..._.pick(req.body, [
        'name',
        'shortDescription',
        'detailDescription',
        'unitsInStock',
        'totalImport',
        'weight',
        'productStatusId'
      ]),
      accountId,
      images: uploadedFiles
    });
    //TODO: await product.addProductTypes(JSON.parse('[2, 3]'));
    await product.addProductTypes(JSON.parse(req.body.productTypeIds));
    let productPricing = await ProductPricing.create({
      basePrice: 230000,
      productId: product && product.id
    });
    let productDiscount = await ProductDiscount.create({
      discountValue: 50,
      discountUnit: 1000,
      lasting: 30,
      amount: 200,
      productId: product && product.id
    });
    res.json({
      product,
      discount: productDiscount,
      pricing: productPricing
    });
  } catch (error) {
    logger.error(error.message, error);
    res.status(400).json('Something went wrong.');
  }
};

module.exports = {
  show_all_products,
  show_products_by_page,
  add_product
};
