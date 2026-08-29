const jwt = require('jsonwebtoken');

const COOKIE_NAME = 'ankita_session';

function verifyToken(req, res, next) {
    const token = req.cookies ? req.cookies[COOKIE_NAME] : null;
    if (!token) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    try {
        req.user = jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid or expired session' });
    }
}

function requireAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    });
}

function requireSuperAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.role !== 'superadmin') {
            return res.status(403).json({ error: 'Super admin access required' });
        }
        next();
    });
}

module.exports = { COOKIE_NAME, verifyToken, requireAdmin, requireSuperAdmin };
