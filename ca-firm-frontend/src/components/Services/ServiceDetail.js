import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import ServiceIcon from './ServiceIcons';
import useDocumentTitle from '../../hooks/useDocumentTitle';

// One template drives every practice-area page, fetched from the admin-
// managed services table - every field here (title, summary, scope,
// deliverables, who it's for, related services) is editable from the
// admin dashboard. Tabbed instead of a long scroll: the header stays put
// and only the tab pane below it changes, so exploring scope, deliverables,
// who it's for, and related services doesn't require scrolling through
// each section in turn.
const ServiceDetail = () => {
  const { slug } = useParams();
  const [services, setServices] = useState(null); // null = still loading
  const [tab, setTab] = useState('scope');
  useDocumentTitle(services?.find((s) => s.slug === slug)?.title);

  useEffect(() => {
    axios.get(API_ENDPOINTS.SERVICES)
      .then((response) => setServices(response.data))
      .catch((error) => {
        console.error('Error fetching services:', error);
        setServices([]);
      });
  }, []);

  useEffect(() => { setTab('scope'); }, [slug]);

  if (services === null) return null; // brief loading state, avoids a false "not found" flash
  const index = services.findIndex((s) => s.slug === slug);
  const service = services[index];
  if (!service) return <Navigate to="/services" replace />;

  const related = service.related
    .map((relSlug) => services.find((s) => s.slug === relSlug))
    .filter(Boolean);

  const tabs = [
    { key: 'scope', label: 'Scope of work' },
    { key: 'deliverables', label: `Deliverables (${service.deliverables.length})` },
    { key: 'who', label: "Who it's for" },
    ...(related.length > 0 ? [{ key: 'related', label: 'Related' }] : [])
  ];

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

      <section className="panel svc-tabbed">
        <div className="svc-tabbar" role="tablist">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={`svc-tab${tab === t.key ? ' active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="svc-tabpane">
          {tab === 'scope' && <p>{service.scope}</p>}

          {tab === 'deliverables' && (
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
          )}

          {tab === 'who' && (
            <div className="svc-callout">
              <span className="svc-callout-label">Made for</span>
              <p>{service.who_for}</p>
            </div>
          )}

          {tab === 'related' && (
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
          )}
        </div>
      </section>

      <section className="cta-band cta-band-compact">
        <div className="panel cta-inner">
          <h2>Have a question about this service?</h2>
          <Link to="/contact" className="btn btn-primary">Discuss with a partner</Link>
        </div>
      </section>
    </>
  );
};

export default ServiceDetail;
