const APIError = require('./../../errors/APIError');
const { ObjectId } = require('mongoose').Types;
const _ = require('lodash');
const Post = require('./../../../models/post.model');

module.exports = () => {
  return async (req, res, next) => {
    const ids = parseIds(req.query.ids);

    if (ids.length === 0) {
      return next(new APIError('INV_ID', 400));
    }

    const posts = await Post.findByIds(ids, req.user._id);

    res.json({ result: posts });
  };
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
