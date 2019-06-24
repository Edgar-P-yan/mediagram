const onlyUsers = require('./../only-users');
const errorHandler = require('./../error-handler');
const PromiseRouter = require('express-promise-router');

module.exports = app => {
  const router = PromiseRouter();

  router.use(onlyUsers());

  router.get('/profileWall', require('./controllers/get-profile-wall')());
  router.get('/personalWall', require('./controllers/get-personal-wall')());

  router.use(errorHandler());

  app.use('/wall', router);
};
