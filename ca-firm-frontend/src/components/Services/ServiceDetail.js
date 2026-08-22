import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import services, { getServiceBySlug } from '../../data/services';
import Reveal from '../motion/Reveal';
import useDocumentTitle from '../../hooks/useDocumentTitle';

// One template drives all 8 practice-area pages, driven by src/data/services.js,
// instead of 8 near-identical files that only differed in copy.
const ServiceDetail = () => {
  const { slug } = useParams();
  const service = getServiceBySlug(slug);
  useDocumentTitle(service?.title);

  if (!service) return <Navigate to="/services" replace />;

  const related = service.related
    .map((relSlug) => getServiceBySlug(relSlug))
    .filter(Boolean);

  return (
    <>
      <div className="panel crumb">
        <Link to="/services">Schedule {service.num}</Link> / <strong>{service.title}</strong>
      </div>

      <section className="svc-hero panel">
        <h1>{service.title}</h1>
        <p>{service.summary}</p>
      </section>

      <Reveal as="section" className="svc-sec panel">
        <h2>Scope of work</h2>
        <p>{service.scope}</p>
      </Reveal>

      <Reveal as="section" className="svc-sec panel">
        <h2>Deliverables</h2>
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

      <Reveal as="section" className="svc-sec panel">
        <h2>Who it's for</h2>
        <p>{service.whoFor}</p>
      </Reveal>

      <section className="section panel">
        <span className="related-title">Related services</span>
        <div className="related-list">
          {related.map((rel) => (
            <Link key={rel.slug} to={`/service/${rel.slug}`} className="sch-row">
              <span className="sch-num num">{rel.num}</span>
              <span className="sch-text">
                <span className="sch-title">{rel.title}</span>
              </span>
              <span className="sch-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

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

// Exported so App.js can validate route slugs stay in sync with the data.
export const serviceSlugs = services.map((s) => s.slug);
