const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const logger = require('../utils/logger');
const { requireAdmin } = require('../middleware/auth');

// Public: submit an enquiry
router.post('/', [
    body('name').isString().trim().notEmpty(),
    body('email').isEmail(),
    body('subject').isString().trim().notEmpty(),
    body('message').isString().trim().notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name, email, subject, message } = req.body;
        const result = await pool.query(
            'INSERT INTO contact_submissions (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, subject, message]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error inserting contact submission', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin only - enquiries contain the submitter's name/email/message (PII).
router.get('/', requireAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contact_submissions WHERE is_active = true ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/all', requireAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM contact_submissions ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id/status', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const isActive = req.body.isActive !== undefined ? Boolean(req.body.isActive) : false;
        await pool.query('UPDATE contact_submissions SET is_active = $1 WHERE id = $2', [isActive, id]);
        res.json({ message: 'Enquiry status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
