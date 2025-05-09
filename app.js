// app.js ─ точка входа сервиса Reviews‑OK
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/*--------------------------- DEBUG -----------------------------------------*/
console.log('> ENV:', {
  GOOGLE_CLIENT_ID:  process.env.GOOGLE_CLIENT_ID,
  SESSION_SECRET:   !!process.env.SESSION_SECRET,
  REDIS_URL:        process.env.REDIS_URL,
  NODE_ENV:         process.env.NODE_ENV
});
/*---------------------------------------------------------------------------*/

const express  = require('express');
const session  = require('express-session');
const passport = require('./src/auth');

const { createClient } = require('redis');
const RedisStore       = require('connect-redis')(session);

// ─────────────────────── Redis ───────────────────────
const redisClient = createClient({
  url       : process.env.REDIS_URL,     // redis://user:pass@host:port
  legacyMode: true,                      // нужен connect‑redis@5
  socket    : { family: 4 }              // принудительно IPv4
});

redisClient.on('error', err => console.error('❌ Redis error:', err));

// ─────────────────────── Express ─────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// подключаемся к Redis, а потом запускаем всю остальную логику
redisClient.connect().then(() => {
  console.log('✅ Redis connected');

  // сессии через Redis
  app.use(session({
    store            : new RedisStore({ client: redisClient }),
    secret           : process.env.SESSION_SECRET,
    resave           : false,
    saveUninitialized: false,
    cookie: {
      secure  : process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge  : 24 * 60 * 60 * 1000   // 1 сутки
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  /* ──────────────── Роуты ────────────────────────── */
  app.get('/', (_, res) => res.send('Reviews‑OK сервис запущен!'));

  app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (_, res) => res.redirect('/dashboard')
  );

  app.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/auth/google');
    res.send(`Привет, ${req.user.displayName}!`);
  });
  /* ──────────────────────────────────────────────── */

  app.listen(PORT, () =>
    console.log(`🚀 Сервер запущен на порту ${PORT}`));
}).catch(err => {
  console.error('❌ Не удалось подключиться к Redis:', err);
  process.exit(1);                      // пусть PM2 перезапустит сервис
});
