// Creates the first superadmin account, but only if admin_users is
// currently empty - safe to run on every deploy (e.g. from a Render
// Pre-Deploy Command, which is the only way to reach a free-tier Postgres
// instance that blocks external connections). Once an account exists this
// becomes a silent no-op.
//
// Reads credentials from env vars rather than argv, since it's meant to
// run unattended as part of a deploy step:
//   ADMIN_BOOTSTRAP_USERNAME
//   ADMIN_BOOTSTRAP_PASSWORD

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

async function run() {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM admin_users');
    if (rows[0].count > 0) {
        console.log('admin_users already has an account - skipping bootstrap.');
        await pool.end();
        return;
    }

    const username = process.env.ADMIN_BOOTSTRAP_USERNAME;
    const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
    if (!username || !password) {
        console.log('ADMIN_BOOTSTRAP_USERNAME/PASSWORD not set - skipping bootstrap.');
        await pool.end();
        return;
    }

    const hashed = await bcrypt.hash(password, 12);
    await pool.query(
        'INSERT INTO admin_users (username, password, role) VALUES ($1, $2, $3)',
        [username, hashed, 'superadmin']
    );
    console.log('Bootstrap superadmin account created:', username);
    await pool.end();
}

run().catch((error) => {
    console.error('Bootstrap failed:', error.message);
    process.exit(1);
});
