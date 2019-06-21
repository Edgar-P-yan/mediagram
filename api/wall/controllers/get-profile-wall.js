const Post = require('../../../models/post.model');
const User = require('../../../models/user.model');
const { ObjectId } = require('mongoose').Types;
const APIError = require('../../errors/APIError');
const _ = require('lodash');

module.exports = () => {
  return async (req, res) => {
    const { userId, skip, limit } = parseParams(req.query, req.user._id);

    if (!userId.equals(req.user._id) && !(await User.exists(userId))) {
      throw new APIError('USER_NOT_FOUND', 404);
    }

    const { count, posts } = await Post.getPaginatedPosts(userId, skip, limit);

    res.json({
      result: {
        count,
        posts,
      },
    });
  };
};

function parseParams(query, defaultUserId) {
  const params = {
    limit: null,
    skip: null,
    userId: null,
  };

  if (!query.userId) {
    params.userId = defaultUserId;
  } else {
    try {
      params.userId = ObjectId.createFromHexString(query.userId);
    } catch (err) {
      throw new APIError('INV_ID', 400);
    }
  }

  if (!_.isInteger(+query.limit)) {
    throw new APIError('INV_VAL', 400);
  }

  if (+query.limit > 30) {
    throw new APIError('TOO_LARGE_LIMIT', 400);
  }

  if (!_.isInteger(+query.skip)) {
    throw new APIError('INV_VAL', 400);
  }

  params.limit = +query.limit || 10; // if limit is 0, no limit will be specified to mongodb
  params.skip = +query.skip;

  return params;
}
