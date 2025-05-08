const path = require('path');
// Жёстко указываем, где искать .env
require('dotenv').config({
  path: path.resolve(__dirname, '.env')
});

module.exports = {
  apps: [
    {
      name: 'reviews-ok',
      cwd: path.resolve(__dirname),
      script: 'app.js',
      error_file: './logs/err.log',
      out_file:  './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env_production: {
        NODE_ENV:            'production',
        PORT:                3000,
        GOOGLE_CLIENT_ID:     process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        SESSION_SECRET:       process.env.SESSION_SECRET,
        REDIS_URL:            process.env.REDIS_URL
      }
    }
  ]
};
