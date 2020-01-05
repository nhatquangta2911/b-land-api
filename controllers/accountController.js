const Sequelize = require('sequelize');
const { logger } = require('../middlewares/logging');
const Op = Sequelize.Op;
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const ErrorHelper = require('../helpers/ErrorHelper');
const config = require('../config');
const { Account } = require('../startup/db');
const { upload } = require('../helpers/UploadToS3Helper');

const show_all_accounts = async (req, res) => {
  try {
    let accounts = await Account.findAll();
    res.json({ accounts, total: accounts.length });
  } catch (error) {
    logger.error(error.message, error);
    res.status(400).json('Something went wrong.');
  }
};

const register_account = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    const file = req.files && req.files.avatar;
    if (!file) {
      return ErrorHelper.BadRequest(res, 'No File Uploaded');
    } else {
      if (
        _.indexOf(
          [
            'image/png',
            'image/jpeg',
            'image/gif',
            'image/tiff',
            'image/svg+xml'
          ],
          file.mimetype
        ) === -1
      ) {
        return ErrorHelper.BadRequest(
          res,
          'Accept image only (*.png, *.jpg, *.jpeg, *.gif, *.tiff, *.svg)' +
            file.mimetype
        );
      } else {
        if (file.size < 2 * 1024 * 1024) {
          upload(res, file, async data => {
            const result = await Account.create({
              ..._.pick(req.body, ['name', 'email', 'phone']),
              avatar: data,
              password
            });
            res.json(result);
          });
        } else {
          ErrorHelper.BadRequest(
            res,
            'BIG FILE ERROR: Choose file which is less than 5MB'
          );
        }
      }
    }
  } catch (error) {
    ErrorHelper.InternalServerError(res, error);
  }
};

const login = async (req, res) => {
  try {
    let account = await Account.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!account) {
      return ErrorHelper.BadRequest(res, 'Username or password is not correct');
    } else {
      const validPassword = await bcrypt.compare(
        req.body.password,
        account.password
      );
      if (!validPassword)
        return ErrorHelper.BadRequest(
          res,
          'Username or password is not correct.'
        );
      const token = jwt.sign(account.toJSON(), config.TOKEN_SECRET_KEY, {
        expiresIn: 900
      });
      res.json({ token, account });
    }
  } catch (error) {
    logger.error(error, error.message);
    ErrorHelper.InternalServerError(res, error);
  }
};

const change_password = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await Account.findOne({ where: { id: req.params.id } });
    if (!account) return ErrorHelper.NotFound(res, 'Account is not exist');
    const valid = await bcrypt.compare(req.body.oldPassword, account.password);
    if (!valid) {
      return ErrorHelper.BadRequest(res, 'Current password is not correct');
    } else {
      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(req.body.newPassword, salt);
      await Account.update(
        { ...account, password: newPassword },
        { where: { id } }
      );
      res.json({ status: 'success' });
    }
  } catch (error) {
    logger.error(error.message, error);
    ErrorHelper.InternalServerError(res, error);
  }
};

const change_info = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await Account.findOne({ where: { id: req.params.id } });
    if (!account) {
      return ErrorHelper.NotFound(res, 'Account is not exist');
    } else {
      const file = req.files && req.files.avatar;
      if (!file) {
        await Account.update(
          {
            ..._.pick(req.body, ['name', 'email', 'phone', 'avatar']),
            password: account.password
          },
          { where: { id } }
        );
        res.json({ result: 'update success', updatedAccount: req.body });
      } else {
        if (file.size < 2 * 1024 * 1024) {
          upload(res, file, async data => {
            await Account.update(
              {
                ..._.pick(req.body, ['name', 'email', 'phone']),
                avatar: data,
                password: account.password
              },
              { where: { id } }
            );
            res.json({ result: 'update success', updatedAccount: req.body });
          });
        } else {
          ErrorHelper.BadRequest(
            res,
            'BIG FILE ERROR: Choose file which is less than 5MB'
          );
        }
      }
    }
  } catch (error) {
    logger.error(error.message, error);
    ErrorHelper.InternalServerError(res, error);
  }
};

module.exports = {
  show_all_accounts,
  register_account,
  login,
  change_password,
  change_info
};
