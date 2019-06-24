const APIError = require('../../errors/APIError');
const { ObjectId } = require('mongoose').Types;
const Like = require('./../../../models/like.model');

module.exports = () => {
  return async (req, res) => {
    const postId = parsePostId(req.query.postId);

    await Like.dislike(req.user._id, postId);

    res.json({
      result: { ok: 1 },
    });
  };
};

function parsePostId(postId) {
  try {
    return ObjectId.createFromHexString(postId);
  } catch (err) {
    throw new APIError('INV_ID', 400);
  }
}
