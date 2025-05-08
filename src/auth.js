const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NODE_ENV
} = process.env;

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret:  GOOGLE_CLIENT_SECRET,
    callbackURL:   'https://reviews-ok.online/auth/google/callback',
    scope:         ['profile', 'email']
  },
  (accessToken, refreshToken, profile, done) => {
    // TODO: поиск или создание пользователя в БД
    done(null, profile);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
