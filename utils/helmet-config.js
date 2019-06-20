module.exports = app => {
  app.use(
    require('helmet')({
      frameguard: { action: 'deny' },
      hidePoweredBy: true,
      ieNoOpen: true,
      noSniff: true,
      xssFilter: true,
    }),
  );
  return app;
};
