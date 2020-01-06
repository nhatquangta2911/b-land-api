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
        { model: ProductType, through: { attributes: [] } }
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
        { model: ProductType, through: { attributes: [] } }
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

    const files =
      req.files && req.files.images && typeof req.files.images === 'array'
        ? req.files.images
        : _.fill(Array(1), req.files.images);
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
      basePrice: req.body.basePrice,
      productId: product && product.id
    });
    let productDiscount = await ProductDiscount.create({
      discountValue: req.body.discountValue,
      discountUnit: req.body.discountUnit,
      lasting: req.body.lasting,
      amount: req.body.amount,
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
const update_product = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findOne({
      include: [
        Account,
        ProductStatus,
        ProductPricing,
        ProductDiscount,
        { model: ProductType, through: { attributes: [] } }
      ],
      where: { id }
    });
    if (!product) return ErrorHelper.NotFound(res, 'Product is not exist');

    const accountId = req.headers['id'];
    const account = await Account.findOne({ where: { id: accountId } });
    if (!account) return ErrorHelper.BadRequest(res, 'Account not found');

    const files =
      req.files && req.files.images && typeof req.files.images === 'array'
        ? req.files.images
        : _.fill(Array(1), req.files.images);
    if (!files || files.length === 0) {
      await Product.update(
        {
          ..._.pick(req.body, [
            'name',
            'shortDescription',
            'detailDescription',
            'unitsInStock',
            'totalImport',
            'weight',
            'productStatusId'
          ]),
          images: product.images,
          accountId
        },
        { where: { id } }
      );
      await product.removeProductTypes(_.map(product.productTypes, 'id'));
      await product.addProductTypes(JSON.parse(req.body.productTypeIds));
      await ProductPricing.update(
        {
          basePrice: req.body.basePrice,
          productId: product && product.id
        },
        { where: { id: product.productPricing.id } }
      );
      await ProductDiscount.update(
        {
          discountValue: req.body.discountValue,
          discountUnit: req.body.discountUnit,
          lasting: req.body.lasting,
          amount: req.body.amount,
          productId: product && product.id
        },
        { where: { id: product.productDiscount.id } }
      );
    } else {
      let uploadedFiles = [];
      for (let file of files) {
        uploadedFiles.push(await uploadMulti(file));
      }

      await Product.update(
        {
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
        },
        { where: { id } }
      );
      //TODO: await product.addProductTypes(JSON.parse('[2, 3]'));
      await product.removeProductTypes(_.map(product.productTypes, 'id'));
      await product.addProductTypes(JSON.parse(req.body.productTypeIds));
      await ProductPricing.update(
        {
          basePrice: req.body.basePrice,
          productId: product && product.id
        },
        { where: { id: product.productPricing.id } }
      );
      await ProductDiscount.update(
        {
          discountValue: req.body.discountValue,
          discountUnit: req.body.discountUnit,
          lasting: req.body.lasting,
          amount: req.body.amount,
          productId: product && product.id
        },
        { where: { id: product.productDiscount.id } }
      );
    }
    res.json({
      product
    });
  } catch (error) {
    logger.error(error.message, error);
    res.status(400).json('Something went wrong.');
  }
};

const delete_product = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id }
    });
    if (!product) return ErrorHelper.NotFound(res, 'Product Not Found');
    await product.removeProductTypes(_.map(product.productTypes, 'id'));
    await ProductDiscount.destroy({
      where: {
        productId: product.id
      }
    });
    await ProductPricing.destroy({
      where: { productId: product.id }
    });
    await Product.destroy({
      where: { id: product.id }
    });
    res.json({ status: 'success' });
  } catch (error) {
    logger.error(error.message, error);
    res.status(400).json('Something went wrong.');
  }
};

module.exports = {
  show_all_products,
  show_products_by_page,
  add_product,
  update_product,
  delete_product
};
