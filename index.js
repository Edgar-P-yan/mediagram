const debug = require('debug')('main');
const dotenv = require('dotenv');
dotenv.config({
  path: `.${process.env.NODE_ENV || 'development'}.env`,
});

const PORT = process.env.PORT || '3000';

require('./app')
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
