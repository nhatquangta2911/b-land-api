const { ExpiredToken } = require('../startup/db');
const ErrorHelper = require('../helpers/ErrorHelper');
const { logger } = require('../middlewares/logging');
const jwt = require('jsonwebtoken');
const config = require('../config');

module.exports = roles => {
  return async (req, res, next) => {
    try {
      const token =
        req.body.token || req.query.token || req.headers['x-access-token'];
      const result = await ExpiredToken.findAndCountAll({
        where: {
          token: token
        }
      });
      if (result.count !== 0) {
        logger.error('Permission Error: NO PERMISSION');
        ErrorHelper.Unauthorized(res, 'Permission Error: NO PERMISSION');
        return;
      }
      const decoded = await jwt.verify(token, config.TOKEN_SECRET_KEY);
      req.decoded = decoded;
      let userRoles = decoded.roles;
      let check = false;

      for (var i = 0; i < userRoles.length; i++) {
        for (var j = 0; j < roles.length; j++) {
          if (userRoles[i].name === roles[j]) {
            check = true;
          }
        }
      }
      if (check) {
        next();
      } else {
        logger.error('Permission Error: NO PERMISSION');
        ErrorHelper.Unauthorized(res, 'Permission Error: NO PERMISSION');
      }
    } catch (error) {
      logger.error(error, error.message);
      ErrorHelper.InternalServerError(res, error);
    }
  };
};
