-- Adds one more site_settings key for the WhatsApp widget's pre-filled
-- message, which was hardcoded in WhatsAppWidget.js. Uses ON CONFLICT DO
-- NOTHING per-row (not the "table is empty" guard 002 used) since this
-- table already has rows on any DB that ran 002 - this pattern lets future
-- migrations add individual settings keys safely regardless of what's
-- already there.
INSERT INTO site_settings (key, value) VALUES
    ('whatsapp_message', 'Hello! I''m interested in your CA services and would like to know more about your offerings. Could you please help me?')
ON CONFLICT (key) DO NOTHING;
