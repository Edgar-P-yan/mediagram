const { ObjectId } = require('mongoose').Types;
const Follow = require('./../../../models/follow.model');
const APIError = require('./../../errors/APIError');
const User = require('./../../../models/user.model');

module.exports = () => {
  return async (req, res) => {
    const userId = !req.query.userId
      ? req.user._id
      : parseUserId(req.query.userId);

    if (!userId.equals(req.user._id) && !(await User.exists(userId))) {
      throw new APIError('USER_NOT_FOUND', 404);
    }

    const result = await Follow.find(
      { following: userId },
      { following: false },
    )
      .sort({ createdAt: -1 })
      .populate('follower', '_id username photoId');

    res.json({ result });
  };
};

function parseUserId(userId) {
  try {
    return ObjectId.createFromHexString(userId);
  } catch (err) {
    throw new APIError('INV_ID', 400);
  }
}
