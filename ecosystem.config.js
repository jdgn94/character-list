module.exports = {
  apps: [
    {
      name: 'character-list-api-dev',
      cwd: __dirname,
      // use npm here for portability; pnpm works too if available globally
      script: 'npm',
      args: 'run start:dev',
      env: {
        NODE_ENV: 'development',
      },
      // keep one instance in dev mode; for production you might use cluster mode
      exec_mode: 'fork',
      watch: false,
    },
  ],
};
