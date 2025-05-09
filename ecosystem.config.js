// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'reviews-ok',
      script: 'app.js',

      // общие переменные
      env_production: {
        NODE_ENV: 'production',
        PORT:     3000
      },

      // вот это подгрузит все строки из вашего .env
      env_file: '.env'
    }
  ]
}
