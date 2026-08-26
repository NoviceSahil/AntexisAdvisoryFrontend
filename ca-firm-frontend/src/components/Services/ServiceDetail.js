import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import Reveal from '../motion/Reveal';
import ServiceIcon from './ServiceIcons';
import useDocumentTitle from '../../hooks/useDocumentTitle';

// One template drives every practice-area page, fetched from the admin-
// managed services table instead of the old static src/data/services.js -
// every field here (title, summary, scope, deliverables, who it's for,
// related services) is editable from the admin dashboard.
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
  const index = services.findIndex((s) => s.slug === slug);
  const service = services[index];
  if (!service) return <Navigate to="/services" replace />;

  const related = service.related
    .map((relSlug) => services.find((s) => s.slug === relSlug))
    .filter(Boolean);

  return (
    <>
      <div className="panel crumb">
        <Link to="/services">Schedule {String(index + 1).padStart(2, '0')}</Link> / <strong>{service.title}</strong>
      </div>

      <section className="svc-hero panel">
        <div className="svc-hero-top">
          <span className="svc-hero-icon"><ServiceIcon slug={service.slug} /></span>
          <span className="svc-hero-num num">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <h1>{service.title}</h1>
        <p>{service.summary}</p>
      </section>

      <Reveal as="section" className="svc-sec panel">
        <h2>Scope of work</h2>
        <p>{service.scope}</p>
      </Reveal>

      {/* Directly answers "what is this made for" as a visually distinct
          callout rather than another plain paragraph, so it's the one
          thing on the page a skimming visitor can't miss. */}
      <Reveal as="section" className="svc-sec panel">
        <div className="svc-callout">
          <span className="svc-callout-label">Made for</span>
          <p>{service.who_for}</p>
        </div>
      </Reveal>

      <Reveal as="section" className="svc-sec panel">
        <h2>Deliverables <span className="svc-count">({service.deliverables.length})</span></h2>
        <ul className="deliv-list">
          {service.deliverables.map(([title, desc], i) => (
            <li key={title}>
              <span className="dl-letter">{String.fromCharCode(97 + i)}.</span>
              <div>
                <strong>{title}</strong>
                <span>{desc}</span>
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      {related.length > 0 && (
        <section className="section panel">
          <span className="related-title">Related services</span>
          <div className="related-list">
            {related.map((rel) => (
              <Link key={rel.slug} to={`/service/${rel.slug}`} className="sch-row">
                <span className="sch-num num">{String(services.findIndex((s) => s.slug === rel.slug) + 1).padStart(2, '0')}</span>
                <span className="sch-text">
                  <span className="sch-title">{rel.title}</span>
                </span>
                <span className="sch-arrow">→</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="cta-band">
        <div className="panel cta-inner">
          <h2>Have a question about this service?</h2>
          <Link to="/contact" className="btn btn-primary">Discuss with a partner</Link>
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;
