// Single source of truth for the 8 practice areas - used by Home, the
// Services hub, and the service detail template, so the list only exists
// in one place instead of being duplicated across three components.
const services = [
  {
    num: '01',
    slug: 'audit-and-assurance',
    title: 'Audit & Assurance',
    summary: 'Statutory audit, internal controls and financial transparency.',
    scope: 'We run statutory and internal audits that go beyond a sign-off - surfacing control gaps and financial-reporting risk before they become findings your board has to explain.',
    deliverables: [
      ['Statutory audit report', 'Filed and board-ready'],
      ['Internal controls review', 'Gap analysis and remediation plan'],
      ['Management letter', 'Plain-language findings'],
      ['Audit committee briefing', 'Optional, in person']
    ],
    whoFor: 'Private limited companies and LLPs approaching a statutory audit threshold, and boards that want assurance their controls hold up to investor or lender scrutiny.',
    related: ['business-advisory-internal-audit', 'risk-advisory', 'corporate-financial-advisory']
  },
  {
    num: '02',
    slug: 'business-advisory-internal-audit',
    title: 'Business Advisory & Internal Audit',
    summary: 'Governance, performance and growth-focused reviews.',
    scope: 'We review how the business actually runs - processes, controls and decision points - and hand back specific, prioritised changes rather than a generic maturity score.',
    deliverables: [
      ['Internal audit programme', 'Risk-ranked, cycle-based'],
      ['Process review', 'Bottlenecks and control gaps mapped'],
      ['Governance advisory', 'Board and committee structure'],
      ['Performance benchmarking', 'Against peer businesses']
    ],
    whoFor: 'Growing businesses that have outgrown founder-led oversight and need a structured second pair of eyes on operations.',
    related: ['audit-and-assurance', 'risk-advisory', 'book-keeping-and-outsourcing']
  },
  {
    num: '03',
    slug: 'book-keeping-and-outsourcing',
    title: 'Book Keeping & Outsourcing',
    summary: 'GST-ready records and outsourced monthly accounting.',
    scope: 'Day-to-day bookkeeping, reconciliations and reporting handled end-to-end, kept audit-ready and tax-ready every month rather than reconstructed at year-end.',
    deliverables: [
      ['Monthly bookkeeping', 'Ledgers, reconciliations, reporting'],
      ['GST-ready records', 'Aligned to return filing'],
      ['MIS reports', 'P&L, cash flow, receivables'],
      ['Payroll processing', 'Optional add-on']
    ],
    whoFor: 'Small and mid-size businesses that would rather not run an in-house accounts team, or need to fill a gap while hiring one.',
    related: ['good-services-tax', 'corporate-financial-advisory', 'audit-and-assurance']
  },
  {
    num: '04',
    slug: 'good-services-tax',
    title: 'Goods & Services Tax (GST)',
    summary: 'Practical GST return filing, audit support and strategy.',
    scope: 'Return filing handled on schedule, GST audits supported end-to-end, and structuring advice given before a transaction happens, not after a notice arrives.',
    deliverables: [
      ['Monthly/quarterly return filing', 'GSTR-1, 3B and reconciliation'],
      ['GST audit support', 'Documentation and representation'],
      ['Input credit reconciliation', '2A/2B matching'],
      ['Notice response drafting', 'When required']
    ],
    whoFor: 'Any GST-registered business that wants filings handled reliably and a plan for the ones that get complicated.',
    related: ['book-keeping-and-outsourcing', 'transfer-pricing', 'corporate-law-secretarial-support']
  },
  {
    num: '05',
    slug: 'transfer-pricing',
    title: 'Transfer Pricing',
    summary: 'Documentation, benchmarking and dispute-ready reporting.',
    scope: 'Transfer pricing documentation and benchmarking built to hold up under scrutiny, prepared ahead of filing deadlines rather than assembled reactively.',
    deliverables: [
      ['TP documentation', 'Local file, aligned to Indian TP rules'],
      ['Benchmarking study', 'Comparable selection and analysis'],
      ['Accountant’s report (3CEB)', 'Filed on schedule'],
      ['Policy design', 'For new intercompany arrangements']
    ],
    whoFor: 'Indian entities with cross-border related-party transactions who need defensible documentation, not just a filed form.',
    related: ['good-services-tax', 'corporate-financial-advisory', 'audit-and-assurance']
  },
  {
    num: '06',
    slug: 'corporate-financial-advisory',
    title: 'Corporate Financial Advisory',
    summary: 'Fundraising, valuation and cash-flow planning.',
    scope: 'Financial planning and deal support for businesses raising capital, valuing a stake, or trying to see further ahead than this quarter’s cash position.',
    deliverables: [
      ['Fundraising support', 'Data room, investor materials'],
      ['Valuation report', 'DCF, comparables, or both'],
      ['Cash-flow modelling', 'Rolling 13-week or annual'],
      ['Deal structuring advice', 'Tax-aware']
    ],
    whoFor: 'Founders and finance teams preparing for a raise, a sale, or simply better forward visibility on cash.',
    related: ['audit-and-assurance', 'transfer-pricing', 'risk-advisory']
  },
  {
    num: '07',
    slug: 'risk-advisory',
    title: 'Risk Advisory',
    summary: 'Risk frameworks, control testing and governance.',
    scope: 'Risk assessments that name the specific exposures your business actually carries, with controls sized to the business rather than a generic checklist.',
    deliverables: [
      ['Enterprise risk assessment', 'Ranked by likelihood and impact'],
      ['Control testing', 'Design and operating effectiveness'],
      ['Fraud risk review', 'Targeted, not routine'],
      ['Governance advisory', 'Policy and escalation design']
    ],
    whoFor: 'Boards and management teams who want risk exposure named in specific terms before it becomes an incident.',
    related: ['business-advisory-internal-audit', 'audit-and-assurance', 'corporate-law-secretarial-support']
  },
  {
    num: '08',
    slug: 'corporate-law-secretarial-support',
    title: 'Corporate Law & Secretarial Support',
    summary: 'ROC filings, board documentation, compliance.',
    scope: 'Statutory filings and board documentation kept current and on schedule, so compliance is a routine cadence rather than a periodic scramble.',
    deliverables: [
      ['ROC filings', 'Annual returns, event-based filings'],
      ['Board & AGM documentation', 'Minutes, resolutions, notices'],
      ['Statutory registers', 'Maintained and audit-ready'],
      ['Incorporation & structuring', 'New entities, amendments']
    ],
    whoFor: 'Private limited companies and LLPs that want secretarial compliance handled by someone who tracks the deadlines for you.',
    related: ['good-services-tax', 'risk-advisory', 'business-advisory-internal-audit']
  }
];

export const getServiceBySlug = (slug) => services.find((s) => s.slug === slug);

export default services;
