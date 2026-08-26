import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import ServiceIcon from './ServiceIcons';
import useDocumentTitle from '../../hooks/useDocumentTitle';

// One template drives every practice-area page, fetched from the admin-
// managed services table - every field here (title, summary, scope,
// deliverables, who it's for, related services) is editable from the
// admin dashboard.
//
// Laid out as one compact grid instead of stacked sections - fitting
// scope, deliverables, who-it's-for, related services and a CTA on one
// screen with nothing hidden behind a click means using width instead of
// height, since stacking all of that vertically (even without tabs)
// doesn't fit a normal viewport without scrolling.
const ServiceDetail = () => {
  const { slug } = useParams();
  const [services, setServices] = useState(null); // null = still loading
  useDocumentTitle(services?.find((s) => s.slug === slug)?.title);

  useEffect(() => {
    axios.get(API_ENDPOINTS.SERVICES)
      .then((response) => setServices(response.data))
      .catch((error) => {
        console.error('Error fetching services:', error);
        setServices([]);
      });
  }, []);

  if (services === null) return null; // brief loading state, avoids a false "not found" flash
  const service = services.find((s) => s.slug === slug);
  if (!service) return <Navigate to="/services" replace />;

  return (
    <div className="svc-compact panel">
      <div className="svc-compact-head">
        <span className="svc-mini-icon"><ServiceIcon slug={service.slug} /></span>
        <div>
          <h1>{service.title}</h1>
          <p>{service.summary}</p>
        </div>
      </div>

      <div className="svc-compact-grid">
        <div className="svc-compact-col">
          <h2>Scope of work</h2>
          <p>{service.scope}</p>
        </div>

        <div className="svc-compact-col">
          <h2>Deliverables</h2>
          <ul className="svc-mini-list">
            {service.deliverables.map(([title, desc]) => (
              <li key={title}><strong>{title}</strong><span>{desc}</span></li>
            ))}
          </ul>
        </div>

        <div className="svc-compact-col svc-compact-side">
          <div className="svc-callout svc-callout-mini">
            <span className="svc-callout-label">Made for</span>
            <p>{service.who_for}</p>
          </div>

          <Link to="/contact" className="btn btn-primary btn-sm btn-block svc-compact-cta">
            Discuss with a partner
          </Link>
        </div>
      </div>

      <Link to="/services" className="svc-back-link svc-back-link-bottom">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
        Back to services
      </Link>
    </div>
  );
};

export default ServiceDetail;
