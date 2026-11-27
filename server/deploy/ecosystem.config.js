// PM2 process file – run with:  pm2 start deploy/ecosystem.config.js --env production
// cluster mode = one Node process per instance, so all CPU cores are used and a crash/redeploy never drops requests.
module.exports = {
  apps: [
    {
      name: "mpupdate-api",
      script: "index.js",
      cwd: __dirname + "/..",
      exec_mode: "cluster",
      // 2 is right for a 1–2 core VPS; use "max" on 4+ cores
      instances: process.env.API_INSTANCES || 2,
      max_memory_restart: "450M", // restart a worker that leaks past this (raise on bigger servers)
      kill_timeout: 8000, // lets in-flight requests finish on reload
      listen_timeout: 10000,
      autorestart: true,
      exp_backoff_restart_delay: 200,
      time: true,
      env_production: {
        NODE_ENV: "production",
        HOST: "127.0.0.1", // only Nginx can reach it; the port is never exposed to the internet
        UV_THREADPOOL_SIZE: 8, // faster bcrypt / file work
      },
    },
  ],
};
