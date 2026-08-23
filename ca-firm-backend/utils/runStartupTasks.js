// Runs schema migrations and the first-admin bootstrap on every process
// start, using the app's own shared pool. This exists because Render's
// free tier has no shell access and blocks external DB connections (only
// the running app, inside Render's network, can reach the database) and
// no Pre-Deploy Command (paid-tier only) - so "on every boot" is the only
// hook available. Safe to run repeatedly: the migrations use
// CREATE TABLE/INDEX IF NOT EXISTS, the compliance seed only inserts into
// an empty table, and the admin bootstrap only inserts when admin_users is
// empty.

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const logger = require('./logger');

async function runMigrationFile(relativePath) {
    const filePath = path.join(__dirname, '..', relativePath);
    const sql = fs.readFileSync(filePath, 'utf8');
    await pool.query(sql);
}

async function bootstrapAdmin() {
    const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM admin_users');
    if (rows[0].count > 0) return;

    const username = process.env.ADMIN_BOOTSTRAP_USERNAME;
    const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
    if (!username || !password) return;

    const hashed = await bcrypt.hash(password, 12);
    await pool.query(
        'INSERT INTO admin_users (username, password, role) VALUES ($1, $2, $3)',
        [username, hashed, 'superadmin']
    );
    logger.info(`Bootstrap superadmin account created: ${username}`);
}

async function runOnce() {
    await runMigrationFile('migrations/000_full_schema.sql');
    await runMigrationFile('migrations/001_compliance_dates.sql');
    await runMigrationFile('migrations/002_services_and_settings.sql');
    await runMigrationFile('migrations/003_whatsapp_message_setting.sql');
    await bootstrapAdmin();
}

// Retries with a delay - covers cases where a freshly-created database's
// internal hostname takes a while to become resolvable (observed lasting
// longer than a few seconds on a brand new Render Postgres instance),
// which would otherwise silently skip schema setup for the rest of that
// process's lifetime. Runs in the background (see server.js), so a long
// window here doesn't delay the app from binding its port.
async function runStartupTasks(attempts = 15, delayMs = 10000) {
    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            await runOnce();
            return;
        } catch (error) {
            if (attempt === attempts) throw error;
            logger.error(`Startup tasks attempt ${attempt}/${attempts} failed, retrying`, { error: error.message });
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
}

module.exports = runStartupTasks;
