const mongoose = require('mongoose');
const AppError = require('./../errors/AppError');
const mongooseHidden = require('mongoose-hidden');
const { Schema } = mongoose;
const { ObjectId } = mongoose.SchemaTypes;

const followSchema = new Schema({
  follower: { type: ObjectId, required: true, index: 1, ref: 'User' },
  following: { type: ObjectId, required: true, index: 1, ref: 'User' },
  createdAt: { type: Date, default: () => new Date(), index: 1 },
});

followSchema.plugin(mongooseHidden({}));

followSchema.index({ follower: 1, following: 1 }, { unique: true });

followSchema.static('follow', async function(followerId, followingId) {
  try {
    await this.create({
      follower: followerId,
      following: followingId,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError('DUP_FOLLOW');
    }
    throw err;
  }
});

const Follow = mongoose.model('Follow', followSchema);

module.exports = Follow;
