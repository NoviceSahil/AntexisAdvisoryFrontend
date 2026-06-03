import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaArrowUp, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.pageYOffset > 300);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAboutUsClick = (e) => {
        e.preventDefault();

        if (location.pathname === '/') {
            const aboutSection = document.getElementById('about-us');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            navigate('/');
            setTimeout(() => {
                const aboutSection = document.getElementById('about-us');
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 200);
        }
    };

    return (
        <footer className="modern-footer">
            <div className="footer-main">
                <Container>
                    <Row className="footer-grid">
                        <Col lg={3} md={6} sm={12} className="footer-col">
                            <div className="footer-section">
                                <h3 className="footer-heading">Antexis Advisory</h3>
                                <p className="footer-description">
                                    Trusted chartered accountancy support for audit, taxation, compliance and strategic growth.
                                </p>
                                <div className="footer-contact-card">
                                    <div className="contact-card-row">
                                        <FaMapMarkerAlt className="footer-contact-icon" />
                                        <p>DSS No. 21, 1st Floor, Huda Sector 13-17, Panipat-132103, Haryana</p>
                                    </div>
                                    <div className="contact-card-row">
                                        <FaEnvelope className="footer-contact-icon" />
                                        <a href="mailto:office@antexisadvisory.com">office@antexisadvisory.com</a>
                                    </div>
                                </div>
                            </div>
                        </Col>

                        <Col lg={3} md={6} sm={12} className="footer-col">
                            <div className="footer-section">
                                <h3 className="footer-heading">Navigate</h3>
                                <ul className="footer-links">
                                    <li><Link to="/">Home</Link></li>
                                    <li><a href="/#about-us" onClick={handleAboutUsClick}>About Us</a></li>
                                    <li><Link to="/services">Services</Link></li>
                                    <li><a href="/blog">Blog & Updates</a></li>
                                    <li><Link to="/apply-online">Careers</Link></li>
                                    <li><Link to="/contact">Contact</Link></li>
                                </ul>
                            </div>
                        </Col>

                        <Col lg={3} md={6} sm={12} className="footer-col">
                            <div className="footer-section">
                                <h3 className="footer-heading">Services</h3>
                                <ul className="footer-links">
                                    <li><Link to="/service/audit-and-assurance">Audit & Assurance</Link></li>
                                    <li><Link to="/service/good-services-tax">GST Compliance</Link></li>
                                    <li><Link to="/service/corporate-financial-advisory">Financial Advisory</Link></li>
                                    <li><Link to="/service/corporate-law-secretarial-support">Corporate Law</Link></li>
                                    <li><Link to="/service/business-advisory-internal-audit">Business Advisory</Link></li>
                                    <li><Link to="/service/risk-advisory">Risk Advisory</Link></li>
                                </ul>
                            </div>
                        </Col>

                        <Col lg={3} md={6} sm={12} className="footer-col">
                            <div className="footer-section">
                                <h3 className="footer-heading">Connect</h3>
                                <p className="footer-description">Follow us for updates, practice insights, and expert commentary.</p>
                                <div className="footer-social-icons">
                                    <a href="https://www.linkedin.com/company/antexisadvisory/" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <FaLinkedin />
                                    </a>
                                    <a href="https://www.instagram.com/antexis_advisory/" aria-label="Instagram" target="_blank" rel="noopener noreferrer" className="social-link">
                                        <FaInstagram />
                                    </a>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <div className="footer-bottom">
                <Container>
                    <div className="footer-bottom-content">
                        <p className="copyright-text">
                            © 2025 <a href="https://www.ankitgaba.com/" target="_blank" rel="noopener noreferrer">Antexis Advisory LLP</a>. All Rights Reserved.
                        </p>
                        <div className="footer-legal-links">
                            <a href="/privacy-policy">Privacy Policy</a>
                            <span className="separator">|</span>
                            <a href="/terms">Terms & Conditions</a>
                        </div>
                    </div>
                </Container>
            </div>

            {showScrollTop && (
                <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
                    <FaArrowUp />
                </button>
            )}
        </footer>
    );
};

export default Footer;
