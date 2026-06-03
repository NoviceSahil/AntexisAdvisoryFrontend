import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';

const Contact = ({ setIsSubmitted }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(API_ENDPOINTS.CONTACT, { name, email, subject, message });
            setIsSubmitted(true);
            navigate('/contact-success');
            console.log({ response });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error sending message. Please try again.');
        }
    };

    return (
        <main className="contact-page">
            <section className="contact-hero">
                <div className="contact-hero-copy">
                    <span className="eyebrow">Contact</span>
                    <h1>Send your message and we'll respond within one business day.</h1>
                    <p>For audit, tax, corporate law, or advisory support, use the form below or connect directly with our team.</p>
                </div>
            </section>

            <section className="contact-grid">
                <aside className="contact-panel contact-details-panel">
                    <p className="panel-label">Office</p>
                    <h2>Panipat, Haryana</h2>
                    <p className="panel-copy">DSS No. 21, 1st Floor, Huda Sector 13-17, Panipat-132103.</p>

                    <div className="info-block">
                        <strong>Email</strong>
                        <a href="mailto:office@antexisadvisory.com">office@antexisadvisory.com</a>
                    </div>

                    <div className="info-block">
                        <strong>Location</strong>
                        <a href="https://www.google.com/maps/place/Ankita+%26+Associates/@29.4258771,76.9792994,20.21z/data=!4m9!1m2!2m1!1santexis+advisory+panipat!3m5!1s0x390dd9ee72a3d5cd:0x6a5e7a1eaa8ec19e!8m2!3d29.4259011!4d76.9795886!16s%2Fg%2F11md1p1k08?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">View on Google Maps</a>
                    </div>

                    <div className="contact-support-card">
                        <p>Need urgent assistance?</p>
                        <p>We provide responsive support for compliance deadlines, audit queries, and corporate filings.</p>
                    </div>
                </aside>

                <section className="contact-panel contact-form-panel">
                    <div className="panel-header">
                        <p className="panel-label">Let's talk</p>
                        <h2>Start your enquiry</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="contact-form">
                        <label>
                            <span>Name</span>
                            <input
                                type="text"
                                placeholder="Your Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <span>Email</span>
                            <input
                                type="email"
                                placeholder="Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <span>Subject</span>
                            <input
                                type="text"
                                placeholder="Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                required
                            />
                        </label>
                        <label>
                            <span>Message</span>
                            <textarea
                                placeholder="Write your message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                            />
                        </label>
                        <button type="submit" className="submit-button">Send Message</button>
                    </form>
                </section>
            </section>
        </main>
    );
};

export default Contact;
