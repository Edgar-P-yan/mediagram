const mongoose = require('mongoose');
const { Schema } = mongoose;
const AuthError = require('../auth/errors/AuthError');
const mongooseHidden = require('mongoose-hidden');

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    bio: { type: String, required: false, default: null },
    createdAt: { type: Date, required: false, default: () => new Date() },
    photoId: { type: String, default: () => null },
    providers: {
      vk: {
        userId: { type: String, required: true, unique: true },
        accessToken: { type: String, required: true },
      },
    },
  },
  { minimize: false },
);

userSchema.plugin(
  mongooseHidden({ defaultHidden: { _id: false, providers: true } }),
);

userSchema.static('exists', async function(id) {
  return !!(await this.findById(id, { _id: true }));
});

userSchema.static('findByVkId', function(vkId, ...args) {
  return this.findOne(
    {
      'providers.vk.userId': vkId,
    },
    ...args,
  );
});

userSchema.static('findByIds', async function(ids, projection) {
  return await this.find({
    _id: { $in: ids },
  })
    .project(projection)
    .toArray();
});

userSchema.static('isUsernameUsed', async function(username) {
  return !!(await this.findOne({ username }, { _id: true }));
});

userSchema.static('register', async function(...args) {
  try {
    return await this.create(...args);
  } catch (err) {
    if (err.code === 11000) {
      if (await this.isUsernameUsed(args[0].username)) {
        throw new AuthError('USERNAME_USED', 400);
      } else {
        throw new AuthError('VK_USED', 400);
      }
    } else {
      throw err;
    }
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
