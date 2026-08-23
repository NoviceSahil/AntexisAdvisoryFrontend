import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import Reveal from '../motion/Reveal';
import CountUp from '../motion/CountUp';
import useDocumentTitle from '../../hooks/useDocumentTitle';

// Fallback defaults if the settings/services fetch fails - keeps the page
// looking correct rather than showing zeros, same idea as the blog section's
// existing loading/empty states.
const DEFAULT_SETTINGS = { years_of_service: '10', clients_supported: '500', regional_offices: '1' };

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const navigate = useNavigate();
  useDocumentTitle('Chartered Accountants');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.BLOGS);
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setBlogsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    axios.get(API_ENDPOINTS.SERVICES)
      .then((response) => setServices(response.data))
      .catch((error) => console.error('Error fetching services:', error));
    axios.get(API_ENDPOINTS.SITE_SETTINGS)
      .then((response) => setSettings((prev) => ({ ...prev, ...response.data })))
      .catch((error) => console.error('Error fetching site settings:', error));
  }, []);

  return (
    <>
      <section className="hero panel">
        <span className="sec-label load-in" style={{ '--rise-delay': '0ms' }}>
          Chartered Accountants · Reg. ICAI
        </span>
        <h1 className="load-in" style={{ '--rise-delay': '90ms' }}>
          Financial clarity, precisely accounted for.
        </h1>
        <p className="lede load-in" style={{ '--rise-delay': '180ms' }}>
          Antexis Advisory LLP manages audit, tax, compliance and corporate
          finance for growing Indian businesses - led by senior chartered
          accountants, start to finish.
        </p>
        <div className="hero-actions load-in" style={{ '--rise-delay': '270ms' }}>
          <Link to="/contact" className="btn btn-primary">Book a free consultation</Link>
          <Link to="/services" className="btn btn-ghost">View services</Link>
        </div>
      </section>

      <div className="panel">
        <div className="stat-rule load-in" style={{ '--rise-delay': '360ms' }}>
          <div className="stat"><CountUp value={Number(settings.years_of_service) || 10} suffix="+" /><span>Years of service</span></div>
          <div className="stat"><CountUp value={Number(settings.clients_supported) || 500} suffix="+" /><span>Clients supported</span></div>
          <div className="stat"><CountUp value={services.length || 8} pad={2} /><span>Practice areas</span></div>
          <div className="stat"><CountUp value={Number(settings.regional_offices) || 1} pad={2} /><span>Regional office</span></div>
        </div>
      </div>

      <section className="section panel">
        <span className="sec-label">Schedule of services</span>
        <Reveal as="h2" className="sec-title">
          Eight practice areas, one senior team across all of them.
        </Reveal>
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
              <span className="card-go">Learn more <span className="card-arrow">→</span></span>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal as="section" className="section panel note">
        <div className="note-mark">&ldquo;</div>
        <blockquote>
          Every engagement is led by a senior chartered accountant from day
          one - not handed off to a team you&rsquo;ve never met.
        </blockquote>
        <div className="note-meta">Why businesses choose Antexis Advisory</div>
        <ul className="note-points">
          <li><strong className="num">01</strong>Senior-led teams on every engagement, not delegated to a junior bench.</li>
          <li><strong className="num">02</strong>Clear, plain-language recommendations - not just compliance paperwork.</li>
          <li><strong className="num">03</strong>Local office in Panipat, with pan-India service.</li>
        </ul>
      </Reveal>

      <section className="section panel">
        <span className="sec-label">Bulletin</span>
        <Reveal as="h2" className="sec-title">Latest from our advisory desk</Reveal>
        {blogsLoading ? (
          <p className="bull-empty">Loading…</p>
        ) : blogs.length === 0 ? (
          <p className="bull-empty">No posts published yet - check back soon.</p>
        ) : (
          blogs.slice(0, 5).map((blog, i) => (
            <Reveal as="div" key={blog.id} className="bull-row" delay={i * 70}>
              <span className="bull-date">{new Date(blog.created_at).toLocaleDateString()}</span>
              <span className="bull-tag">{blog.author}</span>
              <button type="button" className="bull-title" onClick={() => navigate(`/blog/${blog.id}`)}>
                {blog.title}
              </button>
              <span className="bull-arrow">→</span>
            </Reveal>
          ))
        )}
      </section>

      <section className="cta-band">
        <Reveal as="div" className="panel cta-inner">
          <h2>Ready to bring clarity to your books?</h2>
          <Link to="/contact" className="btn btn-primary">Book a free consultation</Link>
        </Reveal>
      </section>
    </>
  );
};

export default Home;
