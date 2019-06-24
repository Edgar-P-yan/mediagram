const session = require('express-session');
const RedisStore = require('connect-redis')(session);

async function connectRedisSession(app) {
  app.use(
    session({
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
      },
      unset: 'keep',
      resave: true,
      saveUninitialized: true,
      secret: process.env.SESSION_SECRET,
      store: new RedisStore({
        url: process.env.REDIS_URL,
      }),
    }),
  );

  return app;
}

module.exports = connectRedisSession;
