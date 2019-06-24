const _ = require('lodash');
const APIError = require('../../errors/APIError');
const Post = require('../../../models/post.model');
const multer = require('multer');
const uuid = require('uuid');

const upload = multer({
  dest: 'uploaded-files/',
  storage: multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
      cb(null, uuid());
    },
  }),
  limits: { fileSize: 10485760 /* 10MB */, files: 1 },
});

module.exports = () => {
  return [
    upload.single('photo'),
    async (req, res) => {
      const { text } = parsePostParams(req.body);
      const photoId = req.file.filename;
      const author = req.user._id;

      const post = await Post.create({
        photoId,
        author,
        text,
      });

      res.json({
        result: {
          postId: post._id.toHexString(),
        },
      });
    },
  ];
};

function parsePostParams(body) {
  if (!body || !_.isString(body.text)) {
    throw new APIError('INVALID_REQ', 400);
  }
  return { text: body.text };
}
