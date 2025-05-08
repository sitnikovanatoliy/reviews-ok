const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  NODE_ENV
} = process.env;

// DEBUG: выводим в лог, что реально подхватилось
console.log('→ [auth] GOOGLE_CLIENT_ID:', GOOGLE_CLIENT_ID);
console.log('→ [auth] GOOGLE_CLIENT_SECRET loaded?', !!GOOGLE_CLIENT_SECRET);
console.log('→ [auth] NODE_ENV:', NODE_ENV);

// Проверим, что обязательные переменные заданы
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error('Google OAuth2 requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to be set');
}

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret:  GOOGLE_CLIENT_SECRET,
    callbackURL:   'https://reviews-ok.online/auth/google/callback',
    scope:         ['profile', 'email']
  },
  (accessToken, refreshToken, profile, done) => {
    // TODO: поиск или создание пользователя в БД по profile.id
    done(null, profile);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = passport;
