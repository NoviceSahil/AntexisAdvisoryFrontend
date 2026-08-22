const { Pool } = require('pg');
require('dotenv').config();

// Hosted platforms (Render, Railway, Heroku-style) give you a single
// DATABASE_URL connection string instead of separate host/user/password
// fields — support both instead of forcing one deployment shape.
const poolConfig = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    };

const pool = new Pool(poolConfig);

pool.on('error', (err) => {
    console.error('Unexpected error on idle Postgres client', err);
});

module.exports = pool;
