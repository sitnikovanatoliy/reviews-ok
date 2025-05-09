// app.js — точка входа Reviews‑OK
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/* -------- DEBUG -------- */
console.log('> ENV:', {
  GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
  REDIS_URL        : process.env.REDIS_URL,
  NODE_ENV         : process.env.NODE_ENV
});
/* ----------------------- */

const express  = require('express');
const session  = require('express-session');
const passport = require('./src/auth');

const { createClient } = require('redis');
const RedisStore       = require('connect-redis').default;

/* ---------- Redis (TLS) ---------- */
const redisClient = createClient({
  url   : process.env.REDIS_URL,   // rediss://user:pass@host:port
  socket: { tls: true }            // TLS‑рукопожатие; IPv4/IPv6 выбирается автоматически
});

redisClient.on('error', (e) => console.error('❌ Redis error:', e));

(async () => {
  await redisClient.connect();
  console.log('✅ Redis connected (TLS)');
})();

/* ---------- Express ---------- */
const app  = express();
const PORT = process.env.PORT || 3000;

app.set('trust proxy', 1);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store : new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure  : process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge  : 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (_, res) => res.send('Reviews‑OK сервис запущен!'));

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile','email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (_, res) => res.redirect('/dashboard')
);

app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/auth/google');
  res.send(`Привет, ${req.user.displayName}!`);
});

app.listen(PORT, () => console.log(`🚀 Сервер слушает ${PORT}`));
