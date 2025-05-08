module.exports = {
  apps: [
    {
      name: 'reviews-ok',
      cwd: '/home/siteok/reviews-ok.online/www/reviews-ok',
      script: 'app.js',

      // подключаем файл .env
      env_file: './.env',

      // сюда попадут NODE_ENV и PORT
      env_production: {
        NODE_ENV: 'production',
        PORT:    3000
      }
    }
  ]
};
