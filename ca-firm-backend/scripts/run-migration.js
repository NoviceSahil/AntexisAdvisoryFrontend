// Runs a .sql file against the database using the same connection config
// the app already uses (config/db.js + .env) - no separate psql install or
// re-entering credentials needed.
//
// Usage:
//   node scripts/run-migration.js migrations/001_compliance_dates.sql

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const fileArg = process.argv[2];

if (!fileArg) {
    console.error('Usage: node scripts/run-migration.js <path-to-sql-file>');
    process.exit(1);
}

const filePath = path.resolve(process.cwd(), fileArg);

async function run() {
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`Running ${filePath} ...`);
    await pool.query(sql);
    console.log('Done.');
    await pool.end();
}

run().catch((error) => {
    console.error('Migration failed:', error.message);
    process.exit(1);
});
