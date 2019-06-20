const PromiseRouter = require('express-promise-router');
const APIError = require('./../errors/APIError');
const { ObjectId } = require('mongoose').Types;
const _ = require('lodash');
const Post = require('./../../models/post.model');

module.exports = app => {
  const router = PromiseRouter();
  router.use(require('./../only-users')());

  router.get('/get', async (req, res, next) => {
    const ids = parseIds(req.query.ids);

    if (ids.length === 0) {
      return next(new APIError('INV_ID', 400));
    }

    res.json(
      await Post.find({ _id: { $in: ids } }).populate(
        'author',
        '_id username photoId',
      ),
    );
  });

  router.post('/create', require('./controllers/post-create')());

  router.post('/like', require('./controllers/like')());

  router.use(require('./../error-handler')());
  app.use('/posts', router);
};

function parseIds(ids) {
  if (ids === undefined) {
    return [];
  }
  if (_.isString(ids)) {
    ids = ids.split(',');
    if (ids.length > 10) {
      throw new APIError('RANGE_ERROR', 400);
    }
    try {
      ids = ids.map(id => ObjectId.createFromHexString(id));
    } catch (err) {
      throw new APIError('INV_ID', 400);
    }
    return ids;
  } else {
    throw new APIError('INV_ID', 400);
  }
}
