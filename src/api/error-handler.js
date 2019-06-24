const APIError = require('./errors/APIError');
const APIBaseError = require('./../errors/APIBaseError');
const debug = require('debug')('api:users');

module.exports = function errorHandler() {
  return (error, req, res, _next) => {
    if (error instanceof APIBaseError) {
      res.status(error.status || 500);
      return res.json({ error });
    }
    res.status(500);
    res.json({ error: new APIError() });
    debug('Unexpected Error: %O', error);
  };
};
