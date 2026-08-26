import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import Reveal from '../motion/Reveal';
import ServiceIcon from './ServiceIcons';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Services = () => {
  useDocumentTitle('Services');
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get(API_ENDPOINTS.SERVICES)
      .then((response) => setServices(response.data))
      .catch((error) => console.error('Error fetching services:', error));
  }, []);

  return (
  <>
    <section className="page-hero panel page-hero-flush">
      <span className="eyebrow">Practice areas</span>
      <h1>Services built for compliance, finance and business growth.</h1>
      <p>
        {services.length || 'Several'} practice area{services.length === 1 ? '' : 's'}, run by one senior team -
        explore each one to see exactly what's delivered and who it's for.
      </p>
    </section>

    <section className="panel svc-rows-wrap">
      {services.map((service, i) => (
        <Reveal
          as={Link}
          key={service.slug}
          to={`/service/${service.slug}`}
          className="svc-row"
          delay={i * 60}
        >
          <span className="svc-row-num num">{String(i + 1).padStart(2, '0')}</span>
          <span className="svc-row-icon"><ServiceIcon slug={service.slug} /></span>
          <span className="svc-row-body">
            <h3>{service.title}</h3>
            <p>{service.summary}</p>
            <span className="svc-row-stats">
              <span className="svc-row-stat">{service.deliverables.length} deliverables</span>
              <span className="svc-row-stat">{service.who_for}</span>
            </span>
          </span>
          <span className="svc-row-go" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </span>
        </Reveal>
      ))}
    </section>

    <section className="cta-band">
      <Reveal as="div" className="panel cta-inner">
        <h2>Not sure which service you need?</h2>
        <Link to="/contact" className="btn btn-primary">Talk to a partner</Link>
      </Reveal>
    </section>
  </>
  );
};

export default Services;
