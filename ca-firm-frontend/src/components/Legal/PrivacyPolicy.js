import React from 'react';

// Real content describing what this site actually collects (matches the
// backend routes exactly: contact form, careers form + resume upload,
// basic visit analytics) - not generic boilerplate. Have this reviewed by
// counsel before treating it as final; it's accurate but not legal advice.
const PrivacyPolicy = () => (
  <>
    <section className="page-hero panel">
      <span className="eyebrow">Legal</span>
      <h1>Privacy Policy</h1>
      <p>Last updated 18 August 2026. This explains what information Antexis Advisory LLP collects through this website and how it's used.</p>
    </section>

    <div className="panel svc-sec" style={{ borderTop: 'none' }}>
      <h2>Information we collect</h2>
      <p style={{ marginBottom: '18px' }}>
        <strong>Contact form:</strong> name, email, subject and message you submit are stored so we can respond to your enquiry.
      </p>
      <p style={{ marginBottom: '18px' }}>
        <strong>Careers form:</strong> name, phone, email, qualification details, address, and the resume file you upload are stored to evaluate your application.
      </p>
      <p>
        <strong>Site analytics:</strong> we record the page visited, your IP address and browser user-agent for basic traffic statistics - this is not tied to your name unless you've also submitted a form.
      </p>
    </div>

    <div className="panel svc-sec">
      <h2>How it's used</h2>
      <p>
        Form submissions are used only to respond to your enquiry or process your application, and are visible to authorised staff through our internal admin system. We do not sell or share your information with third parties for marketing purposes.
      </p>
    </div>

    <div className="panel svc-sec">
      <h2>Your options</h2>
      <p>
        To request that we delete information you've submitted, email{' '}
        <a href="mailto:office@antexisadvisory.com" style={{ textDecoration: 'underline' }}>office@antexisadvisory.com</a>{' '}
        with your request and we'll action it within a reasonable time.
      </p>
    </div>
  </>
);

export default PrivacyPolicy;
