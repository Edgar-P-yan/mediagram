const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden');
const { Schema } = mongoose;

const { ObjectId } = mongoose.SchemaTypes;

const postSchema = new Schema({
  photoId: { type: String, required: true, index: 1 },
  author: { type: ObjectId, required: true, index: 1, ref: 'User' },
  text: { type: String },
  createdAt: { type: Date, default: () => new Date(), index: 1 },
});

postSchema.plugin(mongooseHidden({ defaultHidden: { _id: false } }));

postSchema.static('exists', async function(id) {
  return !!(await this.findById(id, { _id: true }));
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
