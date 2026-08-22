// One-off migration: the legacy server.js compared admin passwords in
// plaintext, so any admin account created before this change almost
// certainly has a plaintext value in admin_users.password. Since the app
// now authenticates with bcrypt.compare, those accounts would silently stop
// being able to log in. This script re-hashes any row whose password isn't
// already a bcrypt hash, in place, so nobody's login breaks.
//
// Run once after deploying: node scripts/migrate-hash-passwords.js

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const BCRYPT_PREFIX = /^\$2[aby]\$/;

async function run() {
    const { rows } = await pool.query('SELECT id, username, password FROM admin_users');
    let migrated = 0;

    for (const user of rows) {
        if (BCRYPT_PREFIX.test(user.password)) {
            continue; // already hashed
        }
        const hashed = await bcrypt.hash(user.password, 12);
        await pool.query('UPDATE admin_users SET password = $1 WHERE id = $2', [hashed, user.id]);
        console.log(`Migrated password for admin user "${user.username}" (id ${user.id})`);
        migrated += 1;
    }

    console.log(migrated > 0
        ? `Done - migrated ${migrated} account(s).`
        : 'Done - no plaintext passwords found, nothing to migrate.');
    await pool.end();
}

run().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
});
