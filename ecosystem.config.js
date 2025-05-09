// ecosystem.config.js
module.exports = {
  apps: [{
    name   : 'reviews-ok',
    script : 'app.js',

    // PM2 будет читать всё из .env, но базовые переменные укажем явно
    env_production: {
      NODE_ENV: 'production',
      PORT    : 3000
    },

    // говорим PM2, где лежит .env
    env_file: '.env'
  }]
};
