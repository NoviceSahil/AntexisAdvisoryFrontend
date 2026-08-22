const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');
const upload = require('../middleware/upload');
const logger = require('../utils/logger');
const { requireAdmin } = require('../middleware/auth');

// Public: submit a job application
router.post('/apply', upload.single('resume'), [
    body('postAppliedFor').isString().trim().notEmpty(),
    body('name').isString().trim().notEmpty(),
    body('phone').isString().trim().notEmpty(),
    body('email').isEmail(),
    body('qualification').isString().trim().notEmpty(),
    body('yearOfQualification').isInt(),
    body('address').isString().trim().notEmpty(),
    body('otherDetails').optional().isString(),
    body('preferredWorkLocation').isString().trim().notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {
            postAppliedFor, name, phone, email, qualification,
            yearOfQualification, address, otherDetails, preferredWorkLocation
        } = req.body;
        const resumeFilename = req.file ? req.file.filename : null;
        const result = await pool.query(
            `INSERT INTO job_applications
             (post_applied_for, name, phone, email, qualification, year_of_qualification, address, other_details, preferred_work_location, resume_file_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [postAppliedFor, name, phone, email, qualification, yearOfQualification, address, otherDetails, preferredWorkLocation, resumeFilename]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        logger.error('Error saving application', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Admin only from here down - these expose candidate PII (name, phone,
// email, address, resume) and must never be reachable without a session.
router.get('/applications', requireAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM job_applications WHERE is_active = true ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/applications/all', requireAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM job_applications ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/applications/:id/status', requireAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const isActive = req.body.isActive !== undefined ? Boolean(req.body.isActive) : false;
        await pool.query('UPDATE job_applications SET is_active = $1 WHERE id = $2', [isActive, id]);
        res.json({ message: 'Application status updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/download-resume/:filename', requireAdmin, (req, res) => {
    // path.basename() strips any directory component from the param, so a
    // value like "../../../.env" (or its %2e%2e%2f-encoded form, which
    // Express decodes before this handler ever sees it) collapses to just
    // ".env" — there is no longer any way to escape the uploads directory.
    // The resolved-path check below is defense in depth on top of that.
    const requestedFilename = path.basename(req.params.filename);
    const uploadDir = process.env.UPLOAD_PATH || 'uploads';
    const uploadsRoot = path.resolve(process.cwd(), uploadDir);
    const filePath = path.resolve(uploadsRoot, requestedFilename);

    if (!filePath.startsWith(uploadsRoot + path.sep)) {
        return res.status(400).json({ error: 'Invalid filename' });
    }

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }
    const originalName = requestedFilename.split('-').slice(1).join('-') || requestedFilename;
    res.download(filePath, originalName, (err) => {
        if (err) {
            logger.error('Error downloading resume', { error: err.message });
            res.status(500).json({ error: 'Error downloading file' });
        }
    });
});

module.exports = router;
