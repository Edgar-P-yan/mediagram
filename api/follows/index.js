const onlyUsers = require('./../only-users');
const errorHandler = require('./../error-handler');
const PromiseRouter = require('express-promise-router');

module.exports = app => {
  const router = PromiseRouter();

  router.use(onlyUsers());

  router.post('/follow', require('./controllers/follow')());
  router.get('/followers', require('./controllers/get-followers')());
  router.get('/followings', require('./controllers/get-followings')());

  router.use(errorHandler());

  app.use('/follows', router);
};
