const { json } = require('express');
const bodyParser = require('body-parser');

module.exports = app => {
  app.use(json());
  app.use(bodyParser({ extended: true }));
};
