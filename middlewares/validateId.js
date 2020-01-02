const ErrorHelper = require('../helpers/ErrorHelper');

module.exports = (req, res, next) => {
  if (isNaN(req.params.id))
    return ErrorHelper.BadRequest(res, 'ID must be a number.');
  next();
};
