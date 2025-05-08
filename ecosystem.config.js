// Загружаем .env перед тем, как определять конфиг
require('dotenv').config();

module.exports = {
  apps: [
    {
      name: 'reviews-ok',
      cwd: '/home/siteok/reviews-ok.online/www/reviews-ok',
      script: 'app.js',
      error_file: './logs/err.log',
      out_file:  './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env_production: {
        NODE_ENV:            'production',
        PORT:                3000,
        // Всё остальное берём из process.env
        GOOGLE_CLIENT_ID:     process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        SESSION_SECRET:       process.env.SESSION_SECRET,
        REDIS_URL:            process.env.REDIS_URL
      }
    }
  ]
};
