const Follow = require('../../../models/follow.model');
const User = require('../../../models/user.model');
const { ObjectId } = require('mongoose').Types;
const APIError = require('../../errors/APIError');
const AppError = require('../../../errors/AppError');

module.exports = () => {
  return async (req, res) => {
    const followTo = parseFollowTo(req.body.followTo);

    if (followTo.equals(req.user._id)) {
      throw new APIError('SELF_FOLLOW_ERROR', 400);
    }

    if (!(await User.exists(followTo))) {
      throw new APIError('USER_NOT_FOUND', 404);
    }

    try {
      await Follow.follow(req.user._id, followTo);
      res.json({ result: { ok: 1 } });
    } catch (err) {
      if (err instanceof AppError && err.code === 'DUP_FOLLOW') {
        throw new APIError('DUP_FOLLOW', 400);
      }
      throw err;
    }
  };
};

function parseFollowTo(followTo) {
  try {
    return ObjectId.createFromHexString(followTo);
  } catch (err) {
    throw new APIError('INV_ID', 400);
  }
}
