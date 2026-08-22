-- Compliance calendar table.
-- Run this once against your database (psql, a GUI client, or your host's
-- SQL console) before using the new /api/compliance routes or the admin
-- "Compliance Calendar" screen.

CREATE TABLE IF NOT EXISTS compliance_dates (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,       -- e.g. 'GST', 'Income Tax', 'ROC / Corporate'
    title VARCHAR(255) NOT NULL,         -- e.g. 'GSTR-3B - monthly summary return'
    due_date DATE NOT NULL,
    cadence VARCHAR(50),                 -- e.g. 'Monthly', 'Quarterly', 'Annual'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_compliance_dates_due_date ON compliance_dates (due_date);

-- Optional starter data so the page isn't empty on first load - feel free
-- to delete these and add your own from the admin screen instead.
INSERT INTO compliance_dates (category, title, due_date, cadence) VALUES
    ('GST', 'GSTR-3B - monthly summary return', '2026-09-20', 'Monthly'),
    ('GST', 'GSTR-1 - outward supplies', '2026-09-11', 'Monthly'),
    ('Income Tax', 'Advance tax - Q2 instalment', '2026-09-15', 'Quarterly'),
    ('Income Tax', 'TDS/TCS returns - Q2 FY 2026-27', '2026-10-31', 'Quarterly'),
    ('ROC / Corporate', 'AOC-4 - filing of financial statements', '2026-09-30', 'Annual'),
    ('ROC / Corporate', 'MGT-7 - annual return filing', '2026-10-29', 'Annual');
