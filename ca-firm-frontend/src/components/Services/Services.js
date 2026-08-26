import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import Reveal from '../motion/Reveal';
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
    <section className="page-hero panel">
      <span className="eyebrow">Practice areas</span>
      <h1>Services built for compliance, finance and business growth.</h1>
      <p>
        {services.length || 'Several'} practice area{services.length === 1 ? '' : 's'}, run by one senior team -
        hover each to see who it's for, then explore the full scope and deliverables.
      </p>
    </section>

    <section className="panel" style={{ paddingBottom: '76px' }}>
      <div className="service-grid">
        {services.map((service, i) => (
          <Reveal
            as={Link}
            key={service.slug}
            to={`/service/${service.slug}`}
            className="service-card"
            delay={i * 45}
          >
            <span className="num">{String(i + 1).padStart(2, '0')}</span>
            <h3>{service.title}</h3>
            <p>{service.summary}</p>
            <span className="card-hint">{service.who_for}</span>
            <span className="card-go">Learn more <span className="card-arrow">→</span></span>
          </Reveal>
        ))}
      </div>
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
