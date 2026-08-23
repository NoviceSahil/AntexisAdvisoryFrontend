-- Services (replacing the static ca-firm-frontend/src/data/services.js) and
-- a general-purpose site_settings key-value table (Home page stats +
-- contact info, previously hardcoded independently in three components).

CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(150) UNIQUE NOT NULL,
    title VARCHAR(150) NOT NULL,
    summary VARCHAR(300) NOT NULL,
    scope TEXT NOT NULL,
    deliverables JSONB NOT NULL DEFAULT '[]',
    who_for TEXT NOT NULL,
    related JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_services_active ON services (is_active);

CREATE TABLE IF NOT EXISTS site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL
);

-- Seed the 8 services with their current real content, so switching from
-- the static file to this table doesn't change anything visible. Guarded
-- by "table is currently empty" - safe to run on every deploy, same
-- pattern as the compliance_dates seed in 001.
INSERT INTO services (slug, title, summary, scope, deliverables, who_for, related)
SELECT * FROM (VALUES
    (
        'audit-and-assurance',
        'Audit & Assurance',
        'Statutory audit, internal controls and financial transparency.',
        'We run statutory and internal audits that go beyond a sign-off - surfacing control gaps and financial-reporting risk before they become findings your board has to explain.',
        '[["Statutory audit report","Filed and board-ready"],["Internal controls review","Gap analysis and remediation plan"],["Management letter","Plain-language findings"],["Audit committee briefing","Optional, in person"]]'::jsonb,
        'Private limited companies and LLPs approaching a statutory audit threshold, and boards that want assurance their controls hold up to investor or lender scrutiny.',
        '["business-advisory-internal-audit","risk-advisory","corporate-financial-advisory"]'::jsonb
    ),
    (
        'business-advisory-internal-audit',
        'Business Advisory & Internal Audit',
        'Governance, performance and growth-focused reviews.',
        'We review how the business actually runs - processes, controls and decision points - and hand back specific, prioritised changes rather than a generic maturity score.',
        '[["Internal audit programme","Risk-ranked, cycle-based"],["Process review","Bottlenecks and control gaps mapped"],["Governance advisory","Board and committee structure"],["Performance benchmarking","Against peer businesses"]]'::jsonb,
        'Growing businesses that have outgrown founder-led oversight and need a structured second pair of eyes on operations.',
        '["audit-and-assurance","risk-advisory","book-keeping-and-outsourcing"]'::jsonb
    ),
    (
        'book-keeping-and-outsourcing',
        'Book Keeping & Outsourcing',
        'GST-ready records and outsourced monthly accounting.',
        'Day-to-day bookkeeping, reconciliations and reporting handled end-to-end, kept audit-ready and tax-ready every month rather than reconstructed at year-end.',
        '[["Monthly bookkeeping","Ledgers, reconciliations, reporting"],["GST-ready records","Aligned to return filing"],["MIS reports","P&L, cash flow, receivables"],["Payroll processing","Optional add-on"]]'::jsonb,
        'Small and mid-size businesses that would rather not run an in-house accounts team, or need to fill a gap while hiring one.',
        '["good-services-tax","corporate-financial-advisory","audit-and-assurance"]'::jsonb
    ),
    (
        'good-services-tax',
        'Goods & Services Tax (GST)',
        'Practical GST return filing, audit support and strategy.',
        'Return filing handled on schedule, GST audits supported end-to-end, and structuring advice given before a transaction happens, not after a notice arrives.',
        '[["Monthly/quarterly return filing","GSTR-1, 3B and reconciliation"],["GST audit support","Documentation and representation"],["Input credit reconciliation","2A/2B matching"],["Notice response drafting","When required"]]'::jsonb,
        'Any GST-registered business that wants filings handled reliably and a plan for the ones that get complicated.',
        '["book-keeping-and-outsourcing","transfer-pricing","corporate-law-secretarial-support"]'::jsonb
    ),
    (
        'transfer-pricing',
        'Transfer Pricing',
        'Documentation, benchmarking and dispute-ready reporting.',
        'Transfer pricing documentation and benchmarking built to hold up under scrutiny, prepared ahead of filing deadlines rather than assembled reactively.',
        '[["TP documentation","Local file, aligned to Indian TP rules"],["Benchmarking study","Comparable selection and analysis"],["Accountant’s report (3CEB)","Filed on schedule"],["Policy design","For new intercompany arrangements"]]'::jsonb,
        'Indian entities with cross-border related-party transactions who need defensible documentation, not just a filed form.',
        '["good-services-tax","corporate-financial-advisory","audit-and-assurance"]'::jsonb
    ),
    (
        'corporate-financial-advisory',
        'Corporate Financial Advisory',
        'Fundraising, valuation and cash-flow planning.',
        'Financial planning and deal support for businesses raising capital, valuing a stake, or trying to see further ahead than this quarter’s cash position.',
        '[["Fundraising support","Data room, investor materials"],["Valuation report","DCF, comparables, or both"],["Cash-flow modelling","Rolling 13-week or annual"],["Deal structuring advice","Tax-aware"]]'::jsonb,
        'Founders and finance teams preparing for a raise, a sale, or simply better forward visibility on cash.',
        '["audit-and-assurance","transfer-pricing","risk-advisory"]'::jsonb
    ),
    (
        'risk-advisory',
        'Risk Advisory',
        'Risk frameworks, control testing and governance.',
        'Risk assessments that name the specific exposures your business actually carries, with controls sized to the business rather than a generic checklist.',
        '[["Enterprise risk assessment","Ranked by likelihood and impact"],["Control testing","Design and operating effectiveness"],["Fraud risk review","Targeted, not routine"],["Governance advisory","Policy and escalation design"]]'::jsonb,
        'Boards and management teams who want risk exposure named in specific terms before it becomes an incident.',
        '["business-advisory-internal-audit","audit-and-assurance","corporate-law-secretarial-support"]'::jsonb
    ),
    (
        'corporate-law-secretarial-support',
        'Corporate Law & Secretarial Support',
        'ROC filings, board documentation, compliance.',
        'Statutory filings and board documentation kept current and on schedule, so compliance is a routine cadence rather than a periodic scramble.',
        '[["ROC filings","Annual returns, event-based filings"],["Board & AGM documentation","Minutes, resolutions, notices"],["Statutory registers","Maintained and audit-ready"],["Incorporation & structuring","New entities, amendments"]]'::jsonb,
        'Private limited companies and LLPs that want secretarial compliance handled by someone who tracks the deadlines for you.',
        '["good-services-tax","risk-advisory","business-advisory-internal-audit"]'::jsonb
    )
) AS seed(slug, title, summary, scope, deliverables, who_for, related)
WHERE NOT EXISTS (SELECT 1 FROM services);

-- Seed settings from whatever's currently hardcoded, so this migration
-- doesn't change any visible content, only where it's stored.
INSERT INTO site_settings (key, value)
SELECT * FROM (VALUES
    ('years_of_service', '10'),
    ('clients_supported', '500'),
    ('regional_offices', '1'),
    ('contact_phone', '+91 82954 50027'),
    ('contact_email', 'office@antexisadvisory.com'),
    ('contact_address', 'DSS No. 21, 1st Floor, Huda Sector 13-17, Panipat-132103, Haryana')
) AS seed(key, value)
WHERE NOT EXISTS (SELECT 1 FROM site_settings);
