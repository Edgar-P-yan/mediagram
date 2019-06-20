const APIError = require('../../errors/APIError');
const AppError = require('../../../errors/AppError');
const { ObjectId } = require('mongoose').Types;
const Post = require('../../../models/post.model');
const Like = require('./../../../models/like.model');

module.exports = () => {
  return async (req, res, next) => {
    const postId = parsePostId(req.body.postId);
    if (!(await Post.exists(postId))) {
      return next(new APIError('POST_NOT_FOUND', 404));
    }

    try {
      await Like.like(req.user._id, postId);

      res.json({
        result: { ok: 1 },
      });
    } catch (err) {
      if (err instanceof AppError && err.code === 'DUP_LIKE') {
        throw new APIError('DUP_LIKE', 400);
      }
      throw err;
    }
  };
};

function parsePostId(postId) {
  try {
    return ObjectId.createFromHexString(postId);
  } catch (err) {
    throw new APIError('INV_ID', 400);
  }
}
