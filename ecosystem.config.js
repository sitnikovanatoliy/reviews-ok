const path = require('path');

module.exports = {
  apps: [
    {
      name: 'reviews-ok',
      cwd: path.resolve(__dirname),
      script: 'app.js',
      error_file: './logs/err.log',
      out_file:  './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',

      // Указываем PM2, откуда брать .env
      env_file: path.resolve(__dirname, '.env'),

      // Базовые переменные, всегда нужны
      env: {
        NODE_ENV: 'development',
        PORT:     3000
      },

      // Переменные для production
      env_production: {
        NODE_ENV: 'production',
        PORT:     3000
      }
    }
  ]
};
