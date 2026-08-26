const { Pool, types } = require('pg');
require('dotenv').config();

// Postgres DATE columns (e.g. compliance_dates.due_date) have no
// time-of-day or timezone - but pg's default type parser converts them to
// JS Date objects using the server process's LOCAL timezone, which then
// shifts when serialized to UTC for the API response. On this machine
// (IST, UTC+5:30) a stored '2026-09-11' comes back as
// '2026-09-10T18:30:00.000Z' - the wrong calendar day - and would behave
// differently again on a server running in UTC (e.g. Render). Registering
// a type parser for the DATE oid (1082) that returns the raw string
// instead of a Date object avoids the conversion entirely, so every DATE
// column always round-trips as exactly what was stored, everywhere.
types.setTypeParser(1082, (value) => value);

// Hosted platforms (Render, Railway, Heroku-style) give you a single
// DATABASE_URL connection string instead of separate host/user/password
// fields — support both instead of forcing one deployment shape.
const poolConfig = process.env.DATABASE_URL
    ? {
        // Hosted Postgres (Render, Railway, Heroku) requires SSL on external
        // connections regardless of NODE_ENV - e.g. when running migration
        // scripts from a local machine against the External Database URL.
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
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
