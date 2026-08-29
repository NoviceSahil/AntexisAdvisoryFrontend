// PM2 process manager config — keeps the Node process alive, restarts it
// on crash, and can auto-start it on VPS reboot (via `pm2 startup`).
//
// Usage on the server, after `npm install --production`:
//   pm2 start ecosystem.config.js
//   pm2 save
//   pm2 startup   (follow the printed instructions once, so it survives a reboot)

module.exports = {
    apps: [
        {
            name: 'ankita-associates-backend',
            script: 'server.js',
            cwd: __dirname,
            env: {
                NODE_ENV: 'production'
            },
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '400M'
        }
        // Staging runs as a second, independent PM2 app — a separate git
        // checkout, separate .env (different PORT/DB_NAME/CORS_ORIGINS),
        // separate database — on the SAME VPS, at zero extra hosting cost.
        // See DEPLOYMENT.md "Setting up a staging environment" for the
        // one-time setup, then uncomment this (path is just an example —
        // point it at wherever you clone the staging checkout):
        //
        // {
        //     name: 'ankita-associates-backend-staging',
        //     script: 'server.js',
        //     cwd: '/home/deploy/ankita-associates-staging/ca-firm-backend',
        //     env: { NODE_ENV: 'staging' },
        //     instances: 1,
        //     autorestart: true,
        //     watch: false,
        //     max_memory_restart: '300M'
        // }
    ]
};
