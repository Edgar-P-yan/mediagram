const express = require('express');

const app = express();

module.exports = require('./connections/mongoose-connect')()
  .then(() => require('./connections/redis-sessions')(app))
  .then(() => require('./utils/helmet-config')(app))
  .then(() => require('./utils/common-middlewares')(app))
  .then(() => require('./auth/passport-config')(app))
  .then(() => require('./api')(app))
  .then(() => app);
