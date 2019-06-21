const { ObjectId } = require('mongoose').Types;
const Follow = require('./../../../models/follow.model');
const Post = require('./../../../models/post.model');
const APIError = require('./../../errors/APIError');
const User = require('./../../../models/user.model');

module.exports = () => {
  return async (req, res) => {
    const userId = !req.query.userId
      ? req.user._id
      : parseUserId(req.query.userId);

    const user =
      !userId || userId.equals(req.user._id)
        ? req.user
        : await User.findById(userId);

    if (!user) {
      throw new APIError('USER_NOT_FOUND', 404);
    }

    const [flwCount, flwingCount, wallCount] = await Promise.all([
      getFollowersCount(userId),
      getFollowingsCount(userId),
      getWallCount(userId),
    ]);

    res.json({
      result: {
        user,
        flwCount,
        flwingCount,
        wallCount,
      },
    });
  };
};

function parseUserId(userId) {
  try {
    return ObjectId.createFromHexString(userId);
  } catch (err) {
    throw new APIError('INV_ID', 400);
  }
}

function getFollowersCount(userId) {
  return Follow.find({
    following: userId,
  }).count();
}

function getFollowingsCount(userId) {
  return Follow.find({
    follower: userId,
  }).count();
}

function getWallCount(userId) {
  return Post.find({
    author: userId,
  }).count();
}
