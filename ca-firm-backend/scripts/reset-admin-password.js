// Resets an EXISTING admin account's password (by username) to a new
// known value — for when you can't recover the original password (bcrypt
// hashes are one-way, so there's no way to "look it up").
//
// Usage:
//   node scripts/reset-admin-password.js <username> <new-password>

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const [username, password] = process.argv.slice(2);

if (!username || !password) {
    console.error('Usage: node scripts/reset-admin-password.js <username> <new-password>');
    process.exit(1);
}
if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
}

async function run() {
    const hashed = await bcrypt.hash(password, 12);
    const result = await pool.query(
        'UPDATE admin_users SET password = $1 WHERE username = $2 RETURNING id, username, role',
        [hashed, username]
    );
    if (result.rows.length === 0) {
        console.error(`No admin account found with username "${username}".`);
        process.exit(1);
    }
    console.log('Password reset for:', result.rows[0]);
    await pool.end();
}

run().catch((error) => {
    console.error('Failed to reset password:', error.message);
    process.exit(1);
});
