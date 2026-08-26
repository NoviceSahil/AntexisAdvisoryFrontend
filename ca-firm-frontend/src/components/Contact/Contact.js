import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, API_CONFIG } from '../../config/api';
import Reveal from '../motion/Reveal';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const Contact = ({ setIsSubmitted }) => {
  useDocumentTitle('Contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(API_ENDPOINTS.CONTACT, { name, email, subject, message }, API_CONFIG);
      setIsSubmitted(true);
      navigate('/contact-success');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="page-hero panel contact-hero">
        <div className="contact-hero-grid">
          <div className="contact-hero-text">
            <span className="eyebrow">Get in touch</span>
            <h1>Let's talk about your books.</h1>
            <p>Reach out directly, or send a note and a senior advisor will get back to you within one business day.</p>
          </div>

          <Reveal as="div" className="form-card contact-hero-form">
            <form onSubmit={handleSubmit}>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="contact-name">Name</label>
                  <input id="contact-name" type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="field">
                  <label htmlFor="contact-email">Email</label>
                  <input id="contact-email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="field">
                <label htmlFor="contact-subject">Subject</label>
                <input id="contact-subject" type="text" placeholder="What can we help with?" value={subject} onChange={(e) => setSubject(e.target.value)} required />
              </div>
              <div className="field">
                <label htmlFor="contact-message">Message</label>
                <textarea id="contact-message" rows="5" placeholder="Tell us a little about your business and what you need." value={message} onChange={(e) => setMessage(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default Contact;
