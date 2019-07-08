const onlyUsers = require('./../only-users');
const errorHandler = require('./../error-handler');
const PromiseRouter = require('express-promise-router');

module.exports = app => {
  const router = PromiseRouter();

  router.use(onlyUsers());

  router.get('/get', require('./controllers/get')());
  router.get('/profile', require('./controllers/get-profile')());

  router.use(errorHandler());

  app.use('/users', router);
};
