module.exports = {
  apps: [
    {
      name: 'reviews-ok',
      cwd: '/home/siteok/reviews-ok.online/www/reviews-ok',
      script: 'app.js',
      // Переменные по умолчанию (dev)
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      // Переменные для production (подхватываются при --env production)
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        SESSION_SECRET: process.env.SESSION_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
      }
    }
  ]
};
