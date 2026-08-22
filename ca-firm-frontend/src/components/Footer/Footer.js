import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <div className="site-footer-outer">
    <footer className="site-footer panel">
      <div className="foot-top">
        <div>
          <Link to="/" className="brand">
            <span className="mark">A</span>
            <span className="names">
              <strong>Antexis Advisory</strong>
              <span>Chartered Accountants</span>
            </span>
          </Link>
          <p className="foot-statement">Questions about your books? We&rsquo;re a phone call away.</p>
        </div>

        <div className="foot-contact-block">
          <div className="fc-row">
            <strong>Phone</strong>
            <a href="tel:+918295450027">+91 82954 50027</a>
          </div>
          <div className="fc-row">
            <strong>Email</strong>
            <a href="mailto:office@antexisadvisory.com">office@antexisadvisory.com</a>
          </div>
          <div className="fc-row">
            <strong>Office</strong>
            <span>DSS No. 21, 1st Floor, Huda Sector 13-17, Panipat-132103, Haryana</span>
          </div>
          <div className="foot-social">
            <a href="https://www.linkedin.com/company/antexisadvisory/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://www.instagram.com/antexis_advisory/" target="_blank" rel="noopener noreferrer">Instagram</a>
          </div>
        </div>
      </div>

      <nav className="foot-links-row" aria-label="Footer">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/affiliation">Affiliations</Link>
        <Link to="/blog">Blog</Link>
        <Link to="/compliance-calendar">Compliance calendar</Link>
        <Link to="/apply-online">Careers</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <div className="foot-bottom">
        <span>© {new Date().getFullYear()} Antexis Advisory LLP - regulated by ICAI</span>
        <div className="foot-legal">
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  </div>
);

export default Footer;
