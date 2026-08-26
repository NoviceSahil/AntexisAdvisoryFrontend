import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const DEFAULTS = {
  contact_phone: '+91 82954 50027',
  contact_email: 'office@antexisadvisory.com',
  contact_address: 'DSS No. 21, 1st Floor, Huda Sector 13-17, Panipat-132103, Haryana'
};

const iconProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };

const Footer = () => {
  const [settings, setSettings] = useState(DEFAULTS);
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get(API_ENDPOINTS.SITE_SETTINGS)
      .then((response) => setSettings((prev) => ({ ...prev, ...response.data })))
      .catch((error) => console.error('Error fetching site settings:', error));
    axios.get(API_ENDPOINTS.SERVICES)
      .then((response) => setServices(response.data))
      .catch((error) => console.error('Error fetching services:', error));
  }, []);

  const telHref = `tel:+${settings.contact_phone.replace(/[^\d]/g, '')}`;
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="panel foot-grid">
        <div className="foot-col foot-brand-col">
          <Link to="/" className="brand">
            <span className="mark">A</span>
            <span className="names">
              <strong>Antexis Advisory</strong>
              <span>Chartered Accountants</span>
            </span>
          </Link>
          <p className="foot-statement">Audit, tax, GST and corporate advisory for growing Indian businesses - led by senior chartered accountants, start to finish.</p>
          <div className="foot-social">
            <a href="https://www.linkedin.com/company/antexisadvisory/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7.5 10v7M7.5 7.2v.01M12 17v-4.3a2.3 2.3 0 014.5 0V17M12 10.2V17" /></svg>
            </a>
            <a href="https://www.instagram.com/antexis_advisory/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg {...iconProps}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" /></svg>
            </a>
          </div>
        </div>

        <div className="foot-col">
          <span className="foot-col-title">Explore</span>
          <Link to="/">Home</Link>
          <Link to="/services">Services</Link>
          <Link to="/team">Team</Link>
          <Link to="/affiliation">Affiliations</Link>
          <Link to="/blog">Blog</Link>
        </div>

        <div className="foot-col">
          <span className="foot-col-title">Practice areas</span>
          {services.slice(0, 5).map((s) => (
            <Link key={s.slug} to={`/service/${s.slug}`}>{s.title}</Link>
          ))}
          <Link to="/services" className="foot-col-more">View all →</Link>
        </div>

        <div className="foot-col foot-contact-col">
          <span className="foot-col-title">Get in touch</span>
          <a href={telHref}>{settings.contact_phone}</a>
          <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a>
          <span className="foot-address">{settings.contact_address}</span>
          <Link to="/compliance-calendar">Compliance calendar</Link>
          <Link to="/apply-online">Careers</Link>
        </div>
      </div>

      <div className="foot-bottom-outer">
        <div className="panel foot-bottom">
          <span>© {year} Antexis Advisory LLP - regulated by ICAI</span>
          <div className="foot-legal">
            <Link to="/privacy-policy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
