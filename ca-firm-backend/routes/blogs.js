const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const upload = require('../middleware/upload');
const logger = require('../utils/logger');
const { requireAdmin } = require('../middleware/auth');

// Public: active posts for the site
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blogs WHERE is_active = true ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        logger.error('Error fetching blogs', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin: everything, including inactive
router.get('/all', requireAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Public: single post
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM blogs WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', requireAdmin, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
]), [
    body('title').isString().trim().notEmpty(),
    body('content').isString().trim().notEmpty(),
    body('author').isString().trim().notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { title, content, author } = req.body;
        const imageUrl = req.files?.image ? req.files.image[0].filename : null;
        const documentUrl = req.files?.document ? req.files.document[0].filename : null;
        const result = await pool.query(
            'INSERT INTO blogs (title, content, image_url, document_url, author) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [title, content, imageUrl, documentUrl, author]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error adding blog', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', requireAdmin, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, author, previousData } = req.body;

        await pool.query(
            'UPDATE blogs SET title = $1, content = $2, author = $3 WHERE id = $4',
            [title, content, author, id]
        );

        if (previousData) {
            const oldData = JSON.parse(previousData);
            for (const field of ['title', 'content', 'author']) {
                if (oldData[field] !== req.body[field]) {
                    await pool.query(
                        'INSERT INTO blog_edit_logs (blog_id, field_name, old_value, new_value) VALUES ($1, $2, $3, $4)',
                        [id, field, oldData[field], req.body[field]]
                    );
                }
            }
        }

        res.json({ message: 'Blog updated successfully' });
    } catch (error) {
        logger.error('Error updating blog', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id/visibility', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        await pool.query('UPDATE blogs SET is_active = $1 WHERE id = $2', [isActive, id]);
        res.json({ message: 'Blog visibility updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
        res.json({ message: 'Blog deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
