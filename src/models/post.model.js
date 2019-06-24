const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden');
const Follow = require('./follow.model');
const { Schema } = mongoose;

const { ObjectId } = mongoose.SchemaTypes;

const postSchema = new Schema(
  {
    photoId: { type: String, required: true, index: 1 },
    author: { type: ObjectId, required: true, index: 1, ref: 'User' },
    text: { type: String },
    createdAt: { type: Date, default: () => new Date(), index: 1 },
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    minimize: false,
    id: false,
  },
);

postSchema.plugin(mongooseHidden({ defaultHidden: { _id: false } }));

postSchema.virtual('likesCount', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'post',
  count: true,
});

postSchema.virtual('isLiked', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'post',
  justOne: true,
  count: true,
});

postSchema.static('findByIds', async function(ids, userId) {
  const results = await this.find({
    _id: { $in: ids },
  })
    .populate('author')
    .populate('likesCount')
    .populate({
      path: 'isLiked',
      match: { user: userId },
    });

  const sorted = Array(ids.length).fill(null);
  results.forEach(post => {
    const index = ids.findIndex(id => post._id.equals(id));
    sorted[index] = post;
  });
  return sorted;
});

postSchema.static('exists', async function(id) {
  return !!(await this.findById(id, { _id: true }));
});

postSchema.static('getPaginatedPosts', async function(
  author,
  skip,
  limit,
  userId,
) {
  const [count, posts] = await Promise.all([
    this.find({ author }).count(),
    this.find({ author })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author')
      .populate('likesCount')
      .populate({
        path: 'isLiked',
        match: { user: userId },
      }),
  ]);

  return {
    count,
    posts,
  };
});

postSchema.static('getPersonalWall', async function(userId, skip, limit) {
  const followings = await Follow.getFollowings(userId);

  const wall = await Post.find({
    author: { $in: followings },
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('author')
    .populate('likesCount')
    .populate({
      path: 'isLiked',
      match: { user: userId },
    });

  return wall;
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
