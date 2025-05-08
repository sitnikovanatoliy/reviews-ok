// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'reviews-ok',
      script: 'app.js',
      // если вы запускаете с --env production, то pm2 возьмёт эти переменные:
      env_production: {
        NODE_ENV: 'production',
        PORT:     3000,
        // вот здесь прописываем ваш публичный Redis URL:
        REDIS_URL: 'redis://zcanr268.redis.tools:10267'
      },
      // остальные секреты (GOOGLE_CLIENT_ID, SECRET и т.д.) будут загружены внутри app.js через dotenv
    }
  ]
}
