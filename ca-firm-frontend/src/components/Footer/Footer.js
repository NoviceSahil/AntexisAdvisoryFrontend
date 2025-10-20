import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaArrowUp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const [showScrollTop, setShowScrollTop] = useState(false);

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

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="site-primary-footer-wrap">
            <Container className="footer-container">
                <div className="ast-builder-footer-grid-columns site-primary-footer-inner-wrap">
                    
                    <div className="site-footer-primary-section-1 site-footer-section">
                        <aside className="footer-widget-area widget-area" aria-label="Footer Widget 1">
                            <div className="footer-widget-area-inner site-info-inner">
                                <section className="widget widget_block">
                                    <h4 className="widget-title">Antexis Advisory</h4>
                                </section>
                            </div>
                        </aside>
                    </div>

                    <div className="site-footer-primary-section-2 site-footer-section">
                        <aside className="footer-widget-area widget-area" aria-label="Footer Widget 2">
                            <h4 className="widget-title">Follow Us</h4>
                            <div className="footer-social-inner-wrap">
                                <a href="www.linkedin.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer" style={{ color: '#557dbc' }}>
                                    <FaLinkedin />
                                </a>
                                {/* <a href="www.x.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer" style={{ color: '#7acdee' }}>
                                    <FaTwitter />
                                </a>
                                <a href="www.instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer" style={{ color: '#8a3ab9' }}>
                                    <FaInstagram />
                                </a> */}
                            </div>
                        </aside>
                    </div>

                    
                    <div className="site-footer-primary-section-3 site-footer-section">
                        <aside className="footer-widget-area widget-area" aria-label="Footer Widget 3">
                            <div className="footer-widget-area-inner site-info-inner">
                                <section className="widget widget_text">
                                    <h2 className="widget-title">Contact Info</h2>
                                    <div className="textwidget">
                                        <p>Panipat-132103, Haryana, India<br />
                                        Email: ankitaarora949@gmail.com<br />
                                        Contact Number:<br />
                                        +919671647839</p>
                                    </div>
                                </section>
                            </div>
                        </aside>
                    </div>

                    
                    <div className="site-footer-primary-section-4 site-footer-section">
                        <aside className="footer-widget-area widget-area" aria-label="Footer Widget 4">
                            <div className="footer-widget-area-inner site-info-inner">
                                <section className="widget widget_nav_menu">
                                    <h2 className="widget-title">Quick Links</h2>
                                    <nav aria-label="Quick Links">
                                        <ul className="menu">
                                            <li><a href="/">Home</a></li>
                                            <li><a href="/services/">Services</a></li>
                                            {/* <li><a href="/firms-update/">Firm’s Update</a></li> */}
                                        </ul>
                                    </nav>
                                </section>
                            </div>
                        </aside>
                    </div>
                </div>
            </Container> 

            <div className="footer-separator"></div>
            
            <div className="site-below-footer-wrap copyright-container">
                <Container fluid>
                    <div className=" site-below-footer-inner-wrap text-center smaller-copyright-container">
                            <div className="ast-footer-copyright">
                                <p>
                                    <span style={{ fontSize: '10pt', color:'#fff'}}>
                                        Copyright © 2025
                                        <span style={{ color: '#fff' }}>
                                            {' '}
                                            <a style={{ color: '#fff' }} href="https://www.ankitgaba.com/">Ankita &amp; Co.</a>
                                        </span>
                                    </span>
                                </p>
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
        </div> 
    );
};

export default Footer;
