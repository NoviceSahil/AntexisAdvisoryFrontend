const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const logger = require('../utils/logger');
const { requireAdmin, requireSuperAdmin } = require('../middleware/auth');

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const validateEntry = [
    body('title').isString().trim().notEmpty(),
    body('summary').isString().trim().notEmpty(),
    body('scope').isString().trim().notEmpty(),
    body('who_for').isString().trim().notEmpty(),
    body('deliverables').isArray(),
    body('related').isArray()
];

const validateNewSlug = [
    body('slug').isString().trim().matches(SLUG_PATTERN)
        .withMessage('slug must be lowercase letters, numbers and hyphens only')
];

// Public: active services, in the order they were created (the frontend
// derives "01, 02..." from array position - no stored display number).
router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM services WHERE is_active = true ORDER BY id ASC'
        );
        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching services', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: everything, including archived services.
router.get('/all', requireAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM services ORDER BY id ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', requireAdmin, [...validateNewSlug, ...validateEntry], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { slug, title, summary, scope, deliverables, who_for, related } = req.body;
        const result = await pool.query(
            `INSERT INTO services (slug, title, summary, scope, deliverables, who_for, related)
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [slug, title, summary, scope, JSON.stringify(deliverables), who_for, JSON.stringify(related)]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') { // unique_violation on slug
            return res.status(409).json({ error: 'A service with that slug already exists' });
        }
        logger.error('Error adding service', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Slug is intentionally not accepted here - it's the public URL and other
// services' related[] reference it by value, so it's fixed at creation.
router.put('/:id', requireAdmin, validateEntry, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { title, summary, scope, deliverables, who_for, related } = req.body;
        const result = await pool.query(
            `UPDATE services SET title = $1, summary = $2, scope = $3, deliverables = $4, who_for = $5, related = $6
             WHERE id = $7 RETURNING *`,
            [title, summary, scope, JSON.stringify(deliverables), who_for, JSON.stringify(related), id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        logger.error('Error updating service', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id/visibility', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        await pool.query('UPDATE services SET is_active = $1 WHERE id = $2', [isActive, id]);
        res.json({ message: 'Visibility updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Permanent delete is superadmin-only - a plain admin can only archive
// (above). This is stricter than blogs/compliance, which let any admin
// hard-delete; requested specifically for services.
router.delete('/:id', requireSuperAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM services WHERE id = $1', [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
