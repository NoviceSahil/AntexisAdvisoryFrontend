const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const logger = require('../utils/logger');
const { requireAdmin } = require('../middleware/auth');

// Only these keys can be written - not a security boundary on its own
// (this route is already admin-only and values are just displayed as
// plain text, so an arbitrary extra key couldn't do anything harmful
// either way), but there's no reason to let the table accumulate
// untracked keys nothing ever reads.
const ALLOWED_KEYS = new Set([
    'years_of_service',
    'clients_supported',
    'regional_offices',
    'contact_phone',
    'contact_email',
    'contact_address',
    'whatsapp_message'
]);

// Public: every setting as a flat { key: value } object - simpler for the
// frontend to consume than an array of {key, value} rows.
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT key, value FROM site_settings');
        const settings = {};
        result.rows.forEach((row) => { settings[row.key] = row.value; });
        res.json(settings);
    } catch (error) {
        logger.error('Error fetching site settings', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: upsert a partial { key: value } object - only the keys present in
// the request body are touched, everything else is left as-is.
router.put('/', requireAdmin, async (req, res) => {
    const entries = Object.entries(req.body || {}).filter(([key]) => ALLOWED_KEYS.has(key));
    if (entries.length === 0) {
        return res.status(400).json({ error: 'No valid settings provided' });
    }
    try {
        for (const [key, value] of entries) {
            await pool.query(
                `INSERT INTO site_settings (key, value) VALUES ($1, $2)
                 ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
                [key, String(value)]
            );
        }
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        logger.error('Error updating site settings', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
