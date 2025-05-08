module.exports = {
  apps: [
    {
      name: 'reviews-ok',
      cwd: '/home/siteok/reviews-ok.online/www/reviews-ok',
      script: 'app.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
