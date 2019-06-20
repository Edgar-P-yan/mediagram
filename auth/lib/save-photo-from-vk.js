const download = require('download');

module.exports = async (url, photoId) => {
  await download(url, 'uploads', { filename: photoId });
};
