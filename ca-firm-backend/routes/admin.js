const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const pool = require('../config/db');
const logger = require('../utils/logger');
const { COOKIE_NAME, verifyToken, requireSuperAdmin } = require('../middleware/auth');

const isProd = process.env.NODE_ENV === 'production';

const cookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000 // 8 hours
};

// Login is the most sensitive endpoint in the app - rate-limited separately
// and much tighter than the general API limiter.
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts. Please try again later.' }
});

router.post('/login', loginLimiter, [
    body('username').isString().trim().notEmpty(),
    body('password').isString().notEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, password } = req.body;
        const result = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
        const user = result.rows[0];
        const match = user ? await bcrypt.compare(password, user.password) : false;

        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.SECRET_KEY,
            { expiresIn: '8h' }
        );
        res.cookie(COOKIE_NAME, token, cookieOptions);
        res.json({ role: user.role });
    } catch (error) {
        logger.error('Login error', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Lets the frontend ask "am I actually logged in?" against the server,
// instead of trusting a client-side flag.
router.get('/me', verifyToken, (req, res) => {
    res.json({ username: req.user.username, role: req.user.role });
});

router.post('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME, { httpOnly: true, secure: isProd, sameSite: 'strict' });
    res.json({ message: 'Logged out' });
});

// --- Super-admin: manage admin accounts ---

router.get('/users', requireSuperAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT id, username, role, created_at FROM admin_users ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/users', requireSuperAdmin, [
    body('username').isString().trim().notEmpty(),
    body('password').isString().isLength({ min: 8 }),
    body('role').isIn(['admin', 'superadmin'])
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await pool.query(
            'INSERT INTO admin_users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
            [username, hashedPassword, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Username already exists' });
        }
        logger.error('Error adding admin user', { error: error.message });
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/users/:id', requireSuperAdmin, [
    body('username').isString().trim().notEmpty(),
    body('role').isIn(['admin', 'superadmin']),
    body('password').optional({ checkFalsy: true }).isString().isLength({ min: 8 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { id } = req.params;
        const { username, password, role } = req.body;
        const result = password
            ? await pool.query(
                'UPDATE admin_users SET username = $1, password = $2, role = $3 WHERE id = $4 RETURNING id, username, role',
                [username, await bcrypt.hash(password, 12), role, id]
            )
            : await pool.query(
                'UPDATE admin_users SET username = $1, role = $2 WHERE id = $3 RETURNING id, username, role',
                [username, role, id]
            );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/users/:id', requireSuperAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM admin_users WHERE id = $1', [id]);
        res.json({ message: 'Admin user deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
