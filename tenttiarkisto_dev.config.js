module.exports = {
  apps: [
    {
      name: 'tentit',
      script: './bin/index.js',
      cwd: '.',
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'development',
        PORT: 3002,
        TEST_PORT: 3021,
        PGPORT: 54321,
        POSTGRES_USER: 'tentit',
        POSTGRES_PASSWORD: 'tentit',
        POSTGRES_DB: 'tentit_dev',
        PGHOST: 'localhost'
      },
      node_args: '--inspect=0.0.0.0:9230'
    }
  ]
};
