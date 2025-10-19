const express = require('express');
const app = express();

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});
require('dotenv').config();
const fs = require('fs');

const port = process.env.PORT || 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { pool } = require('./config/index');

// Middleware - security and parsers
app.use(helmet());

// Configure CORS: in production restrict to your frontend domain
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:3000').split(',');
app.use(cors({ origin: function(origin, callback){
  if(!origin) return callback(null, true); // allow non-browser requests like Postman
  if(allowedOrigins.indexOf(origin) === -1){
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  }
  return callback(null, true);
}}));

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Rate limiter
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);


// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + extension);
  }
});

const upload = multer({ storage: storage });

// Input validation for /api/apply
const { body, validationResult } = require('express-validator');

// PostgreSQL connection is provided by config/index.js (imported above as `pool`)



// Login endpoint
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', username);

    const result = await pool.query(
      'SELECT * FROM admin_users WHERE username = $1 AND password = $2',
      [username, password]
    );
    
    if (result.rows.length > 0) {
      console.log('Login successful for:', username);
      res.json({ 
        role: result.rows[0].role,
        message: 'Login successful' 
      });
    } else {
      console.log('Invalid credentials for:', username);
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected routes
app.get('/api/applications/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM job_applications ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get ALL contact submissions (including inactive ones)
app.get('/api/contact-submissions/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_submissions ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all contact submissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Visibility toggle endpoint
app.put('/api/:type/:id/visibility', async (req, res) => {
  const { type, id } = req.params;
  const { isActive } = req.body;
  const tableMap ={
    'applications': 'job_applications',
    'contacts' : 'contact_submissions',
    'blogs':'blogs'
  };
  const tableName=tableMap[type];

  if(!tableName){
    return res.status(400).json({error: 'Invalida type specified'});
  }
  
  try {
    await pool.query(
      `UPDATE ${tableName} SET is_active = $1 WHERE id = $2`,
      [isActive, id]
    );
    res.json({ message: '${type}Visibility updated successfully' });
  } catch (error) {
    console.error('Error updating ${type} visibility:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//consolelogs
app.get('/api/applications/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM job_applications ORDER BY id DESC');
    console.log('Fetched applications:', result.rows); // Debug log
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/api/download-resume/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, 'uploads', filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }
  
  const originalName = filename.split('-').slice(1).join('-');
  res.download(filePath, originalName, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(500).send('Error downloading file');
    }
  });
});


app.post('/api/apply', [
  body('postAppliedFor').isString().trim().notEmpty(),
  body('name').isString().trim().notEmpty(),
  body('phone').isString().trim().notEmpty(),
  body('email').isEmail(),
  body('qualification').isString().trim().notEmpty(),
  body('yearOfQualification').isInt(),
  body('address').isString().trim().notEmpty(),
  body('otherDetails').optional().isString(),
  body('preferredWorkLocation').isString().trim().notEmpty()
], upload.single('resume'), async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { postAppliedFor, name, phone, email, qualification, yearOfQualification, address, otherDetails, preferredWorkLocation } = req.body;
    const resumeFilename = req.file ? req.file.filename : null;
    const query = 'INSERT INTO job_applications (post_applied_for, name, phone, email, qualification, year_of_qualification, address, other_details, preferred_work_location, resume_file_name) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';
    const values = [
      postAppliedFor,
      name,
      phone,
      email,
      qualification,
      yearOfQualification,
      address,
      otherDetails,
      preferredWorkLocation,
      resumeFilename
    ];
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  index: false,
  setHeaders: (res, filePath) => {
    // Only allow certain file types
    if (!/\.(pdf|docx|jpg|jpeg|png)$/i.test(filePath)) {
      res.status(403).end('Forbidden');
    }
    // Set CORS header for frontend
    res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    // Set CORP header to allow cross-origin
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Modify your GET endpoint to only fetch active records
app.get('/api/applications', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM job_applications WHERE is_active = true');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/applications/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      'UPDATE job_applications SET is_active = false WHERE id = $1',
      [id]
    );
    res.json({ message: 'Application archived successfully' });
  } catch (error) {
    console.error('Error archiving application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Endpoint to handle contact form submissions
app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO contact_submissions (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, subject, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting contact submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Modify your GET endpoint to only fetch active records
app.get('/api/contact-submissions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contact_submissions WHERE is_active = true');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contact submissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.put('/api/contact-submissions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(
      'UPDATE contact_submissions SET is_active = false WHERE id = $1',
      [id]
    );
    res.json({ message: 'Query archived successfully' });
  } catch (error) {
    console.error('Error archiving application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//to detect visitors
app.post('/api/track-visit', async (req, res) => {
  try {
    const { page_url } = req.body;
    const ip_address = req.ip || '127.0.0.1';;
    const user_agent = req.headers['user-agent'];
    
    await pool.query(
      'INSERT INTO site_visitors (page_url, ip_address, user_agent) VALUES ($1, $2, $3)',
      [page_url, ip_address, user_agent]
    );
    res.status(201).json({ message: 'Visit tracked' });
  } catch (error) {
    console.error('Error tracking visit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/visitor-stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_visits,
        COUNT(DISTINCT ip_address) as unique_visitors,
        DATE(visit_date) as date
      FROM site_visitors
      GROUP BY DATE(visit_date)
      ORDER BY date DESC
    `);
    res.json(stats.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get all admin users
app.get('/api/admin-users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, role, created_at FROM admin_users ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add new admin user
app.post('/api/admin-users', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const result = await pool.query(
      'INSERT INTO admin_users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role, created_at',
      [username, password, role]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding admin user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update admin user
app.put('/api/admin-users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;
    const result = await pool.query(
      'UPDATE admin_users SET username = $1, password = $2, role = $3 WHERE id = $4 RETURNING id, username, role',
      [username, password, role, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete admin user
app.delete('/api/admin-users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM admin_users WHERE id = $1', [id]);
    await pool.query(`SELECT setval('admin_users_id_seq', COALESCE((SELECT MAX(id) FROM admin_users), 0) + 1, false)`);
    res.json({ message: 'Admin user deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Blog storage configuration
const blogStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = file.fieldname === 'image' ? 'uploads/blog-images' : 'uploads/blog-documents';
    if (!fs.existsSync(dest)){
      fs.mkdirSync(dest, { recursive: true });
    }
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + extension);
  }
});

const blogUpload = multer({ storage: blogStorage });

// Add new blog post endpoint
app.post('/api/blogs', blogUpload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    const imageUrl = req.files['image'] ? req.files['image'][0].filename : null;
    const documentUrl = req.files['document'] ? req.files['document'][0].filename : null;

    const result = await pool.query(
      'INSERT INTO blogs (title, content, image_url, document_url, author) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, content, imageUrl, documentUrl, author]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding blog:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve static files from uploads directory
app.use('/uploads/blog-images', express.static(path.join(__dirname, 'uploads/blog-images')));
app.use('/uploads/blog-documents', express.static(path.join(__dirname, 'uploads/blog-documents')));


// Get all active blogs for home page
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs WHERE is_active = true ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error in /api/blogs:', error); // This should print the real error!
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all blogs (including inactive) for admin
app.get('/api/blogs/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/blogs/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const result = await pool.query('SELECT * FROM blogs WHERE id=$1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(result.rows[0]); // Return single object instead of array
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Delete blog endpoint
app.delete('/api/blogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM blogs WHERE id = $1', [id]);
    await pool.query(`SELECT setval('blogs_id_seq', COALESCE((SELECT MAX(id) FROM blogs), 0) + 1, false)`);
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/blogs/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'document', maxCount: 1 }
]), async (req, res) => {
  try {
      const { id } = req.params;
      const { title, content, author, previousData } = req.body;
      const oldData = JSON.parse(previousData);

      // Update blog
      await pool.query(
          'UPDATE blogs SET title = $1, content = $2, author = $3 WHERE id = $4',
          [title, content, author, id]
      );

      // Log changes
      const fields = ['title', 'content', 'author'];
      for (const field of fields) {
          if (oldData[field] !== req.body[field]) {
              await pool.query(
                  'INSERT INTO blog_edit_logs (blog_id, field_name, old_value, new_value) VALUES ($1, $2, $3, $4)',
                  [id, field, oldData[field], req.body[field]]
              );
          }
      }

      res.json({ message: 'Blog updated successfully' });
  } catch (error) {
      console.error('Error updating blog:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});
