const Post = require('../../../models/post.model');
const APIError = require('../../errors/APIError');
const _ = require('lodash');

module.exports = () => {
  return async (req, res) => {
    const { skip, limit } = parseParams(req.query);

    const posts = await Post.getPersonalWall(req.user._id, skip, limit);

    res.json({ result: posts });
  };
};

function parseParams(query) {
  const params = {
    limit: null,
    skip: null,
  };

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
