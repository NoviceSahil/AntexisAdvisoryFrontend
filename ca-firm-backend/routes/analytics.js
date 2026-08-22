const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const logger = require('../utils/logger');
const { requireAdmin } = require('../middleware/auth');

// Public: fire-and-forget page view ping (no PII beyond IP/user-agent,
// which is normal for basic analytics).
router.post('/track-visit', async (req, res) => {
    try {
        const { page_url } = req.body;
        const ip_address = req.ip || '127.0.0.1';
        const user_agent = req.headers['user-agent'];
        await pool.query(
            'INSERT INTO site_visitors (page_url, ip_address, user_agent) VALUES ($1, $2, $3)',
            [page_url, ip_address, user_agent]
        );
        res.status(201).json({ message: 'Visit tracked' });
    } catch (error) {
        logger.error('Error tracking visit', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin only - was publicly reachable before this pass.
router.get('/visitor-stats', requireAdmin, async (req, res) => {
    try {
        const stats = await pool.query(`
            SELECT COUNT(*) as total_visits, COUNT(DISTINCT ip_address) as unique_visitors, DATE(visit_date) as date
            FROM site_visitors
            GROUP BY DATE(visit_date)
            ORDER BY date DESC
        `);
        res.json(stats.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
