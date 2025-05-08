module.exports = {
  apps: [
    {
      name: 'reviews-ok',
      cwd: '/home/siteok/reviews-ok.online/www/reviews-ok',
      script: 'app.js',
      // Логи приложения будут писаться сюда:
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
