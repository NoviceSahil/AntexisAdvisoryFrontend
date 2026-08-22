-- Full schema for a fresh database. Run this BEFORE 001_compliance_dates.sql
-- on any new deployment — until now these tables only existed as whatever
-- was already sitting in the local dev database; there was no file
-- anywhere that could recreate them from scratch.
--
-- Run once: node scripts/run-migration.js migrations/000_full_schema.sql

CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,   -- bcrypt hash, never plaintext
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'superadmin')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(150) NOT NULL,
    image_url VARCHAR(255),
    document_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_edit_logs (
    id SERIAL PRIMARY KEY,
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    field_name VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_applications (
    id SERIAL PRIMARY KEY,
    post_applied_for VARCHAR(150) NOT NULL,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    qualification VARCHAR(150) NOT NULL,
    year_of_qualification INTEGER NOT NULL,
    address TEXT NOT NULL,
    other_details TEXT,
    preferred_work_location VARCHAR(150) NOT NULL,
    resume_file_name VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    submission_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS site_visitors (
    id SERIAL PRIMARY KEY,
    page_url VARCHAR(255),
    ip_address VARCHAR(64),
    user_agent TEXT,
    visit_date TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_applications_active ON job_applications (is_active);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_active ON contact_submissions (is_active);
CREATE INDEX IF NOT EXISTS idx_blogs_active ON blogs (is_active);
CREATE INDEX IF NOT EXISTS idx_site_visitors_date ON site_visitors (visit_date);
