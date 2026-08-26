import React from 'react';

// Abstract geometric marks, not realistic pictograms - built from straight
// lines, circles and simple angles (no freeform curves) so they render
// reliably and match the same abstract-triangle language as the site's
// logo mark, rather than attempting detailed icon art without a design
// tool to iterate against.
const base = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };

const icons = {
  'audit-and-assurance': (
    <svg {...base}><circle cx="12" cy="12" r="8" /><path d="M8.5 12.3l2.4 2.4 4.6-5" /></svg>
  ),
  'business-advisory-internal-audit': (
    <svg {...base}><path d="M5 19V13M11 19V9M17 19V5" /></svg>
  ),
  'book-keeping-and-outsourcing': (
    <svg {...base}><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 9h8M8 12.5h8M8 16h5" /></svg>
  ),
  'good-services-tax': (
    <svg {...base}><path d="M6 18L18 6" /><circle cx="8" cy="8" r="2" /><circle cx="16" cy="16" r="2" /></svg>
  ),
  'transfer-pricing': (
    <svg {...base}><path d="M4 8h11M11 8l-3-3M11 8l-3 3" /><path d="M20 16H9M13 16l3-3M13 16l3 3" /></svg>
  ),
  'corporate-financial-advisory': (
    <svg {...base}><path d="M4 17l5-5 4 4 7-8" /><path d="M16 8h4v4" /></svg>
  ),
  'risk-advisory': (
    <svg {...base}><path d="M12 4l8 15H4L12 4z" /><path d="M12 10.5v3.5" /><circle cx="12" cy="16.7" r="0.9" fill="currentColor" stroke="none" /></svg>
  ),
  'corporate-law-secretarial-support': (
    <svg {...base}><path d="M12 4v3M6 7h12M6 7l-2 6h4l-2-6zM18 7l-2 6h4l-2-6zM8 20h8M12 7v13" /></svg>
  )
};

// Any service without a mapped icon (e.g. a new one added later from the
// admin dashboard) falls back to a plain diamond mark rather than nothing.
const fallback = <svg {...base}><path d="M12 4l6 8-6 8-6-8z" /></svg>;

const ServiceIcon = ({ slug, className }) => (
  <span className={className}>{icons[slug] || fallback}</span>
);

export default ServiceIcon;
