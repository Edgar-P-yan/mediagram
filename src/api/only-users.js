const APIError = require('./errors/APIError');

module.exports = function onlyUsers() {
  return (req, res, next) => {
    if (!req.user) {
      return next(new APIError('NOT_AUTHENTICATED', 403));
    }
    next();
  };
};
