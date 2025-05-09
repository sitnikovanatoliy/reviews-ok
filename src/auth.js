// src/auth.js
const passport       = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const debug          = require('debug')('passport:google');   // <- отладка

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NODE_ENV
} = process.env;

/* ---------- базовая диагностика ---------- */
console.log('→ [auth] GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
console.log('→ [auth] GOOGLE_CLIENT_SECRET loaded?', !!GOOGLE_CLIENT_SECRET);
console.log('→ [auth] NODE_ENV:', NODE_ENV);
/* ----------------------------------------- */

// убеждаемся, что переменные заданы
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error('Google OAuth2 requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to be set');
}

passport.use(
  new GoogleStrategy(
    {
      clientID:     GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL:  'https://reviews-ok.online/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // подробный лог — увидим, доходит ли код сюда
      debug('ACCESS TOKEN %O', accessToken);
      debug('PROFILE      %O', profile);
      return done(null, profile);          // в реальном коде ищем/создаём пользователя
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
