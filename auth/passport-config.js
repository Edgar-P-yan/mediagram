const passport = require('passport');
const { Strategy: VkStrategy } = require('passport-vkontakte');
const User = require('../models/user.model');
const AuthError = require('./errors/AuthError');
const PromiseRouter = require('express-promise-router');
const uuid = require('uuid');
const saveVkPhoto = require('./lib/save-photo-from-vk');

passport.use(
  'vk',
  new VkStrategy(
    {
      apiVersion: '5.92',
      clientID: process.env.VK_CLIENT_ID,
      clientSecret: process.env.VK_CLIENT_SECRET,
      lang: 'ru',
      profileFields: ['photo_200', 'has_photo'],
      callbackURL: process.env.APP_URL + '/auth/vk/callback',
      state: true,
      authorizationURL:
        process.env.VK_OAUTH_AUTH_URL || 'https://oauth.vk.com/authorize',
      tokenURL:
        process.env.VK_OAUTH_ACCESS_TOKEN_URL ||
        'https://oauth.vk.com/access_token',
      profileURL:
        process.env.VK_API_GET_USER_URL ||
        'https://api.vk.com/method/users.get',
    },
    (accessToken, refreshToken, params, vkProfile, done) => {
      User.findByVkId(vkProfile.id)
        .then(user => done(null, { accessToken, vkProfile, user }))
        .catch(err => done(err));
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user._id.toHexString());
});

passport.deserializeUser((uid, done) => {
  User.findById(uid)
    .then(user => done(null, user))
    .catch(done);
});

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  const router = PromiseRouter();

  router.get(
    '/vk',
    onlyGuests(),
    (req, res, next) => {
      passport.authenticate(
        'vk',
        { scope: ['offline'], display: 'popup' },
        err => next(err),
      )(req, res, next);
    },
    errorHandlerViaUrlFragment(),
  );

  router.get(
    '/vk/callback',
    onlyGuests(),
    (req, res, next) => {
      passport.authenticate(
        'vk',
        async (authErr, { accessToken, vkProfile, user }) => {
          try {
            if (authErr) {
              return next(authErr);
            } else if (user) {
              /** user exists */
              user.providers.vk.accessToken = accessToken;
              await user.save();

              await passportLogIn(req, user);
              sendResultInURLFragment(res, { ok: 1 });
            } else {
              /** registration */
              req.session.registration = {
                vkProfile,
                accessToken,
              };
              sendResultInURLFragment(res, { notComplete: true });
            }
          } catch (err) {
            return next(err);
          }
        },
      )(req, res, next);
    },
    errorHandlerViaUrlFragment(),
  );

  router.post('/complete', onlyGuests(), async (req, res, next) => {
    if (!req.session.registration) {
      throw new AuthError('INV_REGISTRATION', 400);
    }
    const { username } = req.body;

    if (!checkUsername(username)) {
      throw new AuthError('INV_USERNAME', 400);
    }

    const vkProfile = req.session.registration.vkProfile;

    // Saving user in the outer scope so we can remove user
    // if registration is going wrong
    let user = null;

    try {
      const photoId =
        vkProfile._json.has_photo && vkProfile._json.photo_200 ? uuid() : null;

      [user] = await Promise.all([
        User.register({
          username,
          bio: null,
          photoId,
          providers: {
            vk: {
              userId: req.session.registration.vkProfile.id,
              accessToken: req.session.registration.accessToken,
            },
          },
        }),
        (() => {
          if (photoId) {
            return saveVkPhoto(vkProfile._json.photo_200, photoId);
          }
          return null;
        })(),
      ]);

      await passportLogIn(req, user);

      res.json({ result: { ok: 1 } });
    } catch (err) {
      if (err instanceof AuthError && err.code === 'USERNAME_USED') {
        return next(err);
      } else {
        req.session.registration = null;
        req.session.save();
        user && (await user.remove());
        return next(err);
      }
    }
  });

  router.get('/result', (req, res) => res.send(''));

  router.use('*', (req, res, next) => {
    next(new AuthError('NOT_FOUND', 404));
  });

  router.use((error, req, res, _next) => {
    if (error instanceof AuthError) {
      res.status(error.status || 500);
      res.json({ error });
    } else {
      res.status(500);
      res.json({ error: new AuthError() });
    }
  });

  app.use('/auth', router);
};

function sendResultInURLFragment(res, result) {
  res.redirect(
    process.env.APP_URL +
      '/auth/result#' +
      encodeURIComponent(JSON.stringify({ result })),
  );
}

function onlyGuests() {
  return (req, res, next) => {
    if (req.user) {
      return next(new AuthError('NOT_GUEST', 403));
    }
    return next();
  };
}

function checkUsername(username) {
  return (
    username.length >= 1 &&
    username.length <= 30 &&
    username.match(/[a-zA-Z0-9_]+/)
  );
}

function passportLogIn(req, user) {
  return new Promise((res, rej) => {
    req.logIn(user, err => {
      if (err) {
        return rej(err);
      }
      return res();
    });
  });
}

function errorHandlerViaUrlFragment() {
  return (err, req, res, _next) => {
    res.redirect(
      process.env.APP_URL +
        '/auth/result#' +
        encodeURIComponent(JSON.stringify({ err })),
    );
  };
}
