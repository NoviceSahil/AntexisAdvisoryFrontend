const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const logger = require('../utils/logger');
const { requireAdmin } = require('../middleware/auth');

const validateEntry = [
    body('category').isString().trim().notEmpty(),
    body('title').isString().trim().notEmpty(),
    body('due_date').isISO8601().withMessage('due_date must be a valid date (YYYY-MM-DD)'),
    body('cadence').optional({ checkFalsy: true }).isString().trim()
];

// Public: active due dates, soonest first
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM compliance_dates WHERE is_active = true ORDER BY due_date ASC'
        );
        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching compliance dates', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: everything, including hidden entries
router.get('/all', requireAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM compliance_dates ORDER BY due_date ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', requireAdmin, validateEntry, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { category, title, due_date, cadence } = req.body;
        const result = await pool.query(
            'INSERT INTO compliance_dates (category, title, due_date, cadence) VALUES ($1, $2, $3, $4) RETURNING *',
            [category, title, due_date, cadence || null]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error adding compliance date', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', requireAdmin, validateEntry, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { category, title, due_date, cadence } = req.body;
        const result = await pool.query(
            'UPDATE compliance_dates SET category = $1, title = $2, due_date = $3, cadence = $4 WHERE id = $5 RETURNING *',
            [category, title, due_date, cadence || null, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        logger.error('Error updating compliance date', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id/visibility', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        await pool.query('UPDATE compliance_dates SET is_active = $1 WHERE id = $2', [isActive, id]);
        res.json({ message: 'Visibility updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM compliance_dates WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
