module.exports = {
  apps: [
    {
      name: 'reviews-ok',
      script: 'app.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        SESSION_SECRET: process.env.SESSION_SECRET || 'change_this_secret',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
      }
    }
  ]
};
