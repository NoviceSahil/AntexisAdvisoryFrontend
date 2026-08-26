import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, MULTIPART_CONFIG } from '../../config/api';
import Reveal from '../motion/Reveal';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const ApplyOnline = ({ setIsSubmitted }) => {
  useDocumentTitle('Careers');
  const [formData, setFormData] = useState({
    postAppliedFor: '',
    name: '',
    phone: '',
    email: '',
    qualification: '',
    yearOfQualification: '',
    address: '',
    otherDetails: '',
    preferredWorkLocation: '',
    resume: null
  });
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Build a real FormData instance - sending the plain `formData` object
    // directly (as the previous version did) doesn't actually multipart-encode
    // the file; axios would just JSON.stringify it despite the header saying
    // multipart/form-data, so the resume never uploaded correctly.
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) payload.append(key, value);
    });

    try {
      await axios.post(API_ENDPOINTS.APPLY, payload, MULTIPART_CONFIG);
      setIsSubmitted(true);
      navigate('/application-success');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <section className="page-hero panel page-hero-flush">
        <div className="split-hero-grid">
          <div className="split-hero-text">
            <span className="eyebrow">Careers</span>
            <h1>Build your practice with us.</h1>
            <p>For current openings, complete the application below - a resume in PDF, JPG or PNG is required.</p>
          </div>

          <Reveal as="div" className="form-card career-hero-form">
        <form onSubmit={handleSubmit}>
          <div className="field-row">
            <div className="field">
              <label htmlFor="postAppliedFor">Post applied for</label>
              <select id="postAppliedFor" name="postAppliedFor" value={formData.postAppliedFor} onChange={handleChange} required>
                <option value="">Choose an option</option>
                <option value="Intern/Trainee">Intern / Trainee</option>
                <option value="International Tax">International Tax</option>
                <option value="Corporate Tax">Corporate Tax</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="qualification">Qualification</label>
              <select id="qualification" name="qualification" value={formData.qualification} onChange={handleChange} required>
                <option value="">Choose an option</option>
                <option value="CA-Final">CA Final</option>
                <option value="CA-Final-Group-I">CA Final - Group I</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="yearOfQualification">Year of qualification</label>
              <input
                id="yearOfQualification"
                type="number"
                name="yearOfQualification"
                placeholder="e.g. 2024"
                min="1970"
                max={new Date().getFullYear()}
                value={formData.yearOfQualification}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="address">Address</label>
              <textarea id="address" rows="2" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="otherDetails">Anything else to add</label>
              <textarea id="otherDetails" rows="2" name="otherDetails" value={formData.otherDetails} onChange={handleChange} />
            </div>
          </div>

          <div className="field-row">
            <div className="field">
              <label htmlFor="preferredWorkLocation">Preferred work location</label>
              <select id="preferredWorkLocation" name="preferredWorkLocation" value={formData.preferredWorkLocation} onChange={handleChange} required>
                <option value="">Choose an option</option>
                <option value="Panipat">Panipat</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="resume">Resume</label>
              <input id="resume" type="file" name="resume" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" required />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit application'}
          </button>
          <p style={{ fontSize: '.82rem', color: 'var(--ink-muted)', marginTop: '18px' }}>
            For any other inquiries, email{' '}
            <a href="mailto:office@antexisadvisory.com" style={{ textDecoration: 'underline' }}>
              office@antexisadvisory.com
            </a>
            .
          </p>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default ApplyOnline;
