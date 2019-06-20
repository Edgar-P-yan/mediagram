const { Router } = require('express');
const errorHandler = require('./error-handler');

module.exports = app => {
  const router = Router();

  require('./users')(router);
  require('./posts')(router);

  app.use('/api', router, errorHandler());
};
