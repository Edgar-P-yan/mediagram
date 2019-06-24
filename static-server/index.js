const express = require('express');

module.exports = app => {
  app.use(
    '/static',
    express.static('uploads', {
      index: false,
      lastModified: false,
      maxAge: '1y',
      setHeaders: res => {
        res.set('Content-Type', 'image/jpeg');
      },
    }),
  );
};
