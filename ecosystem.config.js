module.exports = {
  apps: [{
    name: 'reviews-ok',
    script: 'app.js',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
