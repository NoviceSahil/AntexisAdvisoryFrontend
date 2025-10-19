const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const upload = require('../middleware/upload');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM blogs WHERE is_active = true ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 }
]), async (req, res) => {
    // Blog post creation logic
});

module.exports = router;