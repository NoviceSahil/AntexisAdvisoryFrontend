// Creates the very first admin/superadmin account on a fresh database.
// Needed because admin accounts can only otherwise be created BY an
// existing superadmin through the dashboard — a fresh database has none,
// so there'd be no way to log in at all without this.
//
// Usage:
//   node scripts/create-admin.js <username> <password> [role]
//   node scripts/create-admin.js owner "a-strong-password-here" superadmin

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../config/db');

const [username, password, role = 'superadmin'] = process.argv.slice(2);

if (!username || !password) {
    console.error('Usage: node scripts/create-admin.js <username> <password> [admin|superadmin]');
    process.exit(1);
}
if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
}
if (!['admin', 'superadmin'].includes(role)) {
    console.error('Role must be "admin" or "superadmin".');
    process.exit(1);
}

async function run() {
    const hashed = await bcrypt.hash(password, 12);
    const result = await pool.query(
        'INSERT INTO admin_users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
        [username, hashed, role]
    );
    console.log('Created admin account:', result.rows[0]);
    await pool.end();
}

run().catch((error) => {
    console.error('Failed to create admin account:', error.message);
    process.exit(1);
});
