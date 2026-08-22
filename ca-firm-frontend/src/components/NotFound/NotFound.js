import React from 'react';
import { Link } from 'react-router-dom';

// There was no catch-all route before this - visiting any mistyped or
// removed URL rendered a blank page with no way back.
const NotFound = () => (
  <div className="panel success-shell">
    <span className="eyebrow">404</span>
    <h1>That page doesn't exist.</h1>
    <p>The link may be out of date, or the page may have moved. Here are a few places to go instead.</p>
    <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '8px' }}>
      <Link to="/" className="btn btn-primary">Back to home</Link>
      <Link to="/services" className="btn btn-ghost">View services</Link>
      <Link to="/contact" className="btn btn-ghost">Contact us</Link>
    </div>
  </div>
);

export default NotFound;
