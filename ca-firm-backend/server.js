require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

const logger = require('./utils/logger');
const runStartupTasks = require('./utils/runStartupTasks');
const adminRoutes = require('./routes/admin');
const blogRoutes = require('./routes/blogs');
const applicationRoutes = require('./routes/applications');
const contactRoutes = require('./routes/contact');
const analyticsRoutes = require('./routes/analytics');
const complianceRoutes = require('./routes/compliance');
const servicesRoutes = require('./routes/services');
const settingsRoutes = require('./routes/settings');

const app = express();
app.set('trust proxy', 1);

const port = process.env.PORT || 5000;

app.use(helmet());

// CORS: only the configured frontend origin(s) may make credentialed
// requests (needed so the admin session cookie is sent/accepted).
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // non-browser clients (curl, Postman)
        if (allowedOrigins.indexOf(origin) === -1) {
            logger.warn('CORS origin rejected', { origin, allowedOrigins });
            return callback(new Error('The CORS policy for this site does not allow access from the specified origin.'), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// App-wide baseline limiter; /api/admin/login carries its own, stricter one.
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_PATH || 'uploads'), {
    index: false,
    setHeaders: (res, filePath) => {
        if (!/\.(pdf|docx?|jpg|jpeg|png)$/i.test(filePath)) {
            res.status(403).end('Forbidden');
        }
        res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    }
}));

app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api', applicationRoutes); // POST /api/apply, /api/applications*, /api/download-resume/:filename
app.use('/api/contact', contactRoutes);
app.use('/api', analyticsRoutes); // /api/track-visit, /api/visitor-stats
app.use('/api/compliance', complianceRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/settings', settingsRoutes);

app.use((req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
        return res.status(404).json({ error: 'Not found' });
    }
    next();
});

// Serve the built React app, and let it own client-side routing — this is
// what makes one Node process deployable as the whole site instead of
// needing separate frontend hosting. Only active when the build exists
// (i.e. in production, after `npm run build` in ca-firm-frontend), so
// local development against the CRA dev server is unaffected.
const clientBuildPath = path.join(__dirname, '..', 'ca-firm-frontend', 'build');
if (fs.existsSync(clientBuildPath)) {
    app.use(express.static(clientBuildPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientBuildPath, 'index.html'));
    });
} else {
    app.use((req, res) => res.status(404).json({ error: 'Not found' }));
}

// Centralized error handler - must be registered last.
app.use((err, req, res, next) => {
    logger.error('Unhandled error', { error: err.message, stack: err.stack });
    res.status(500).json({ error: 'Internal server error' });
});

// Bind the port immediately - don't make Render's deploy health check wait
// on the database. Startup tasks (migrations + admin bootstrap) retry in
// the background; routes that need the schema will just 500 until they
// succeed, same as they would on any transient DB outage.
app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

runStartupTasks().catch((error) => {
    logger.error('Startup tasks failed', { error: error.message, stack: error.stack });
});
