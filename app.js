// app.js

// Явно указываем, где лежит .env
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Проверяем, что переменные из .env загрузились:
console.log('> ENV:', {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  REDIS_URL: process.env.REDIS_URL,
  NODE_ENV: process.env.NODE_ENV
});

const express = require('express');
const session = require('express-session');
const passport = require('./src/auth');

// Redis и адаптер для express-session
const { createClient } = require('redis');
const RedisStore = require('connect-redis')(session);

// Создаём и настраиваем Redis-клиент
const redisClient = createClient({ url: process.env.REDIS_URL, legacyMode: true });
redisClient.on('error', err => console.error('❌ Redis Client Error', err));

// Оборачиваем подключение и запуск сервера в async IIFE
(async () => {
  await redisClient.connect();
  console.log('✅ Redis connected');

  const app = express();
  const PORT = process.env.PORT || 3000;

  // доверяем первому прокси (Nginx)
  app.set('trust proxy', 1);

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Сессии и Passport
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000
      }
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Маршруты
  app.get('/', (req, res) => res.send('Reviews-OK сервис запущен!'));

  app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

  app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => res.redirect('/dashboard')
  );

  app.get('/dashboard', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/auth/google');
    res.send('Привет, ' + req.user.displayName + '!');
  });

  app.listen(PORT, () => console.log('🚀 Сервер запущен на порту ' + PORT));
})();
