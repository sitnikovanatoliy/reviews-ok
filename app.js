// загрузка .env в process.env
require('dotenv').config();

const express       = require('express');
const session       = require('express-session');
const passport      = require('./src/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// доверяем первому прокси (Nginx)
app.set('trust proxy', 1);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === Настройка сессий и Passport ===
app.use(session({
  secret: process.env.SESSION_SECRET || 'change_this_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    maxAge: 24 * 60 * 60 * 1000
  }
}));
app.use(passport.initialize());
app.use(passport.session());
// ====================================

app.get('/', (req, res) => {
  res.send('Reviews-OK сервис запущен!');
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/google');
  }
  res.send('Привет, ' + req.user.displayName + '!');
});

app.listen(PORT, () => {
  console.log('Сервер запущен на порту ' + PORT);
});
