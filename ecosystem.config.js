module.exports = {
  apps: [
    {
      name: 'server',
      script: 'dist/server.js',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      }
    },
  ],
}
