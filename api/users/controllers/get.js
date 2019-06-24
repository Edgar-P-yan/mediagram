const User = require('../../../models/user.model');
const APIError = require('./../../errors/APIError');
const { ObjectId } = require('mongoose').Types;
const _ = require('lodash');

module.exports = () => {
  return async (req, res) => {
    const ids = parseIds(req.query.ids);
    if (ids.length === 0) {
      return res.json(req.user);
    }
    res.json({ result: await User.findByIds(ids) });
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
