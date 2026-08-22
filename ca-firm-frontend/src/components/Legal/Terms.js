import React from 'react';

// Standard-form terms content - placeholder-honest, not generic boilerplate
// pretending to be complete. Have this reviewed by counsel before treating
// it as final; it's a reasonable starting draft, not legal advice.
const Terms = () => (
  <>
    <section className="page-hero panel">
      <span className="eyebrow">Legal</span>
      <h1>Terms &amp; Conditions</h1>
      <p>Last updated 18 August 2026. These terms govern your use of this website.</p>
    </section>

    <div className="panel svc-sec" style={{ borderTop: 'none' }}>
      <h2>Website use</h2>
      <p>
        Content on this site is provided for general information about our services and does not constitute professional advice. Any engagement for audit, tax, or advisory services is governed separately by a signed engagement letter, not by these terms.
      </p>
    </div>

    <div className="panel svc-sec">
      <h2>No liability for general content</h2>
      <p>
        While we keep blog and compliance-related content current at the time of publishing, regulations change - always confirm specifics with us directly before acting on anything published here.
      </p>
    </div>

    <div className="panel svc-sec">
      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent to{' '}
        <a href="mailto:office@antexisadvisory.com" style={{ textDecoration: 'underline' }}>office@antexisadvisory.com</a>.
      </p>
    </div>
  </>
);

export default Terms;
