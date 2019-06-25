const debug = require('debug')('main');

if (process.env.NODE_ENV !== 'production') {
  const { error } = require('dotenv').config();
  if (error) {
    debug('Could not load .env');
    throw error;
  }
}

const PORT = process.env.PORT || '3000';

require('./src/app')
  .then(app => {
    app.listen(PORT, () => {
      debug(`Server running on 127.0.0.1:%s`, PORT);
    });
  })
  .catch(err => {
    debug('Server could not start server.');
    debug(err);
    process.exit(1);
  });
