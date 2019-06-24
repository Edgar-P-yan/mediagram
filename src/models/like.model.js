const mongoose = require('mongoose');
const AppError = require('./../errors/AppError');
const { Schema } = mongoose;
const { ObjectId } = mongoose.SchemaTypes;

const likeSchema = new Schema({
  post: { type: ObjectId, required: true, index: 1, ref: 'Post' },
  user: { type: ObjectId, required: true, index: 1, ref: 'User' },
  createdAt: { type: Date, default: () => new Date(), index: 1 },
});

likeSchema.index({ post: 1, user: 1 }, { unique: true });

likeSchema.static('like', async function(userId, postId) {
  try {
    await this.create({
      post: postId,
      user: userId,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError('DUP_LIKE');
    }
    throw err;
  }
});

likeSchema.static('dislike', async function(userId, postId) {
  await this.deleteOne({
    post: postId,
    user: userId,
  });
});

const Like = mongoose.model('Like', likeSchema);

module.exports = Like;
