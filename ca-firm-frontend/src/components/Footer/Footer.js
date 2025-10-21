import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaArrowUp, FaEnvelope, FaMapMarkerAlt, FaPhone, FaCheckCircle } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.pageYOffset > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle hash navigation on page load
    useEffect(() => {
        if (location.hash === '#about-us') {
            setTimeout(() => {
                const aboutSection = document.getElementById('about-us');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, [location]);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleAboutUsClick = (e) => {
        e.preventDefault();
        
        // If already on home page, scroll to section
        if (location.pathname === '/') {
            const aboutSection = document.getElementById('about-us');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // Navigate to home page with hash
            navigate('/#about-us');
            // Wait for navigation and then scroll
            setTimeout(() => {
                const aboutSection = document.getElementById('about-us');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    };

    return (
        <footer className="modern-footer">
            <div className="footer-main">
                <Container>
                    <Row className="footer-grid">
                        {/* Company Info */}
                        <Col lg={3} md={6} sm={12} className="footer-col">
                            <div className="footer-section">
                                <h3 className="footer-heading">Antexis Advisory</h3>
                                <p className="footer-description">
                                    Professional chartered accountancy services with expertise in audit, taxation, and business advisory.
                                </p>
                                {/* <div className="footer-badges">
                                    <div className="badge-item">
                                        <FaCheckCircle className="badge-icon" />
                                        <span>ICAI Certified</span>
                                    </div>
                                    <div className="badge-item">
                                        <FaCheckCircle className="badge-icon" />
                                        <span>10+ Years Experience</span>
                                    </div>
                                </div> */}
                            </div>
                        </Col>

                        {/* Quick Links */}
                        <Col lg={3} md={6} sm={12} className="footer-col">
                            <div className="footer-section">
                                <h3 className="footer-heading">Quick Links</h3>
                                <ul className="footer-links">
                                    <li><a href="/">Home</a></li>
                                    <li><a href="/#about-us" onClick={handleAboutUsClick}>About Us</a></li>
                                    <li><a href="/services">Services</a></li>
                                    <li><a href="/blog">Blog & Updates</a></li>
                                    <li><a href="/apply-online">Careers</a></li>
                                    <li><a href="/contact">Contact Us</a></li>
                                </ul>
                            </div>
                        </Col>

                        {/* Services */}
                        <Col lg={3} md={6} sm={12} className="footer-col">
                            <div className="footer-section">
                                <h3 className="footer-heading">Our Services</h3>
                                <ul className="footer-links">
                                    <li><a href="/service/audit-and-assurance">Audit & Assurance</a></li>
                                    <li><a href="/service/good-services-tax/">GST Complaince</a></li>
                                    <li><a href="/service/corporate-financial-advisory/">Corporate Financial Advisory</a></li>
                                    <li><a href="/service/corporate-law-secretarial-support/">Corporate Law Secretarial Support</a></li>
                                    <li><a href="/services#advisory">Business Advisory</a></li>
                                    <li><a href="/services#compliance">Regulatory Compliance</a></li>
                                </ul>
                            </div>
                        </Col>

                        {/* Contact Info */}
                        <Col lg={3} md={6} sm={12} className="footer-col">
                            <div className="footer-section">
                                <h3 className="footer-heading">Get In Touch</h3>
                                <div className="footer-contact">
                                    <div className="contact-item1">
                                        <FaMapMarkerAlt className="contact-icon" />
                                        <div className="contact-text">
                                            <p>
                                                DSS No. 21, 1st Floor,<br />
                                                Huda Sector 13-17,<br />
                                                Panipat-132103, Haryana, India
                                            </p>
                                            <a
                                                href="https://www.google.com/maps/place/Ankita+%26+Associates/@29.4258771,76.9792994,20.21z/data=!4m9!1m2!2m1!1santexis+advisory+panipat!3m5!1s0x390dd9ee72a3d5cd:0x6a5e7a1eaa8ec19e!8m2!3d29.4259011!4d76.9795886!16s%2Fg%2F11md1p1k08?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="gmap-link"
                                                style={{ display: 'inline-block', marginTop: '6px', fontSize: '0.95em' }}
                                            >
                                                View on Google Maps
                                            </a>
                                        </div>
                                    </div>
                                    <div className="contact-item1">
                                        <FaEnvelope className="contact-icon" />
                                        <div className="contact-text">
                                            <a href="mailto:office@antexisadvisory.com">office@antexisadvisory.com</a>
                                        </div>
                                    </div>
                                    {/* <div className="contact-item1">
                                        <FaPhone className="contact-icon" />
                                        <div className="contact-text">
                                            <a href="tel:+919876543210">+91 98765 43210</a>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </Col>
                    </Row>

                    {/* Social Media Section */}
                    <div className="footer-social-section">
                        <h4 className="social-heading">Connect With Us</h4>
                        <div className="footer-social-icons">
                            <a href="https://www.linkedin.com/company/antexisadvisory/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="social-link">
                                <FaLinkedin />
                            </a>
                            {/* <a href="https://www.facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer" className="social-link">
                                <FaFacebookF />
                            </a> */}
                            {/* <a href="https://www.twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer" className="social-link">
                                <FaTwitter />
                            </a> */}
                            <a href="https://www.instagram.com/antexis_advisory/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="social-link">
                                <FaInstagram />
                            </a>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <Container>
                    <div className="footer-bottom-content">
                        <p className="copyright-text">
                            © 2025 <a href="https://www.ankitgaba.com/" target="_blank" rel="noopener noreferrer">Antexis Advisory LLP</a> All Rights Reserved.
                        </p>
                        <div className="footer-legal-links">
                            <a href="/privacy-policy">Privacy Policy</a>
                            <span className="separator">|</span>
                            <a href="/terms">Terms & Conditions</a>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <button 
                    className="scroll-to-top"
                    onClick={scrollToTop}
                    aria-label="Scroll to top"
                >
                    <FaArrowUp />
                </button>
            )}
        </footer>
    );
};

export default Footer;
