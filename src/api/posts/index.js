const PromiseRouter = require('express-promise-router');

module.exports = app => {
  const router = PromiseRouter();
  router.use(require('./../only-users')());

  router.get('/get', require('./controllers/get')());
  router.post('/create', require('./controllers/post-create')());
  router.post('/like', require('./controllers/like')());
  router.delete('/dislike', require('./controllers/dislike')());

  router.use(require('./../error-handler')());
  app.use('/posts', router);
};
