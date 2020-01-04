/* eslint-disable no-unused-vars */
const { logger } = require('./logging');

module.exports = (err, req, res, next) => {
  logger.error(err);
  res.status(500).send('Something went wrong');
};
