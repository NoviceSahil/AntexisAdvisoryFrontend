import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import ServiceIcon from './ServiceIcons';
import useDocumentTitle from '../../hooks/useDocumentTitle';
// No entrance animation here (unlike most other pages) - Reveal's
// scroll-triggered fade only fires for items already in the natural
// scroll flow; on a page built specifically to need no scrolling, most
// or all cards are visible immediately anyway.

// Compact grid instead of stacked full-width rows - same reasoning as the
// service detail page: fitting every practice area on one screen with no
// scrolling means using width instead of height, so this trades the
// site's usual generous spacing for density, deliberately, only here.
const Services = () => {
  useDocumentTitle('Services');
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get(API_ENDPOINTS.SERVICES)
      .then((response) => setServices(response.data))
      .catch((error) => console.error('Error fetching services:', error));
  }, []);

  return (
    <div className="svc-compact panel">
      <div className="svc-index-head">
        <span className="eyebrow">Practice areas</span>
        <h1>Services built for compliance, finance and business growth.</h1>
      </div>

      <div className="svc-index-grid">
        {services.map((service, i) => (
          <Link key={service.slug} to={`/service/${service.slug}`} className="svc-index-card">
            <span className="svc-index-top">
              <span className="svc-mini-icon"><ServiceIcon slug={service.slug} /></span>
              <span className="svc-index-num num">{String(i + 1).padStart(2, '0')}</span>
            </span>
            <h3>{service.title}</h3>
            <span className="svc-index-go" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Services;
