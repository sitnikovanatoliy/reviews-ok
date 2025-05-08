// Явно указываем, где лежит .env
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

console.log('> ENV:', {
  GOOGLE_CLIENT_ID:     process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  SESSION_SECRET:       process.env.SESSION_SECRET,
  REDIS_URL:            process.env.REDIS_URL
});

const express    = require('express');
const session    = require('express-session');
const passport   = require('./src/auth');

// Подключаем официальный клиент Redis
const { createClient } = require('redis');
// Правильный импорт connect-redis для ESM-версии
const connectRedis     = require('connect-redis');
const RedisStore       = (typeof connectRedis === 'function'
                           ? connectRedis
                           : connectRedis.default)(session);

(async () => {
  const redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on('error', console.error);
  await redisClient.connect();

  const app  = express();
  const PORT = process.env.PORT || 3000;

  app.set('trust proxy', 1);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(session({
    store:             new RedisStore({ client: redisClient }),
    secret:            process.env.SESSION_SECRET,
    resave:            false,
    saveUninitialized: false,
    cookie: {
      secure:   process.env.NODE_ENV === 'production',
      sameSite: 'none',
      maxAge:   24 * 60 * 60 * 1000
    }
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/', (req, res) => res.send('Reviews-OK сервис запущен!'));
  // ... остальные роуты

  app.listen(PORT, () => {
    console.log('Сервер запущен на порту ' + PORT);
  });
})();
