import React, { useRef, useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './NavBar.css';
import caIcon from '../../assets/icai.png';
import { FaEnvelope, FaPhone, FaClock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PHONE = '+91 98765 43210';
const EMAIL = 'office@antexisadvisory.com';
const HOURS = 'Mon–Sat · 9am–6pm';

const NavBar = () => {
    const navigate = useNavigate();
    const navbarRef = useRef(null);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target) && expanded) {
                setExpanded(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [expanded]);


    const handleNavLinkClick = () => {
        setExpanded(false);
    };

    return (
        <header className="site-header" ref={navbarRef}>
            <div className="top-bar">
                <div className="top-bar-content">
                    <a href={`tel:${PHONE.replace(/\s+/g, '')}`} className="top-link" aria-label="Call us">
                        <FaPhone className="top-icon" /> {PHONE}
                    </a>
                    <a href={`mailto:${EMAIL}`} className="top-link" aria-label="Email us">
                        <FaEnvelope className="top-icon" /> {EMAIL}
                    </a>
                    <span className="top-link" aria-label="Office hours">
                        <FaClock className="top-icon" /> {HOURS}
                    </span>
                </div>
            </div>
            <Navbar expand="lg" className="navbar-custom" expanded={expanded} onToggle={setExpanded}>
                <Navbar.Brand href="/" className="navbar-title" onClick={handleNavLinkClick}>
                    <div className="brand-container">
                        <img src={caIcon} alt="Antexis Advisory logo" className="ca-icon" />
                        <div>
                            <span className="brand-name">Antexis Advisory LLP</span>
                            <span className="brand-tagline">Trusted Chartered Accountants</span>
                        </div>
                    </div>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="navbar-collapse-custom">
                    <Nav className="nav-links">
                        <Nav.Link href="/" onClick={handleNavLinkClick}>Home</Nav.Link>
                        <NavDropdown title="Services" id="services-dropdown">
                            <NavDropdown.Item href="/service/audit-and-assurance" onClick={handleNavLinkClick}>Audit &amp; Assurance</NavDropdown.Item>
                            <NavDropdown.Item href="/service/business-advisory-internal-audit" onClick={handleNavLinkClick}>Business Advisory</NavDropdown.Item>
                            <NavDropdown.Item href="/service/book-keeping-and-outsourcing" onClick={handleNavLinkClick}>Book Keeping</NavDropdown.Item>
                            <NavDropdown.Item href="/service/good-services-tax" onClick={handleNavLinkClick}>GST Compliance</NavDropdown.Item>
                            <NavDropdown.Item href="/service/transfer-pricing" onClick={handleNavLinkClick}>Transfer Pricing</NavDropdown.Item>
                            <NavDropdown.Item href="/service/corporate-financial-advisory" onClick={handleNavLinkClick}>Financial Advisory</NavDropdown.Item>
                            <NavDropdown.Item href="/service/risk-advisory" onClick={handleNavLinkClick}>Risk Advisory</NavDropdown.Item>
                            <NavDropdown.Item href="/service/corporate-law-secretarial-support" onClick={handleNavLinkClick}>Corporate Law</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/team" onClick={handleNavLinkClick}>Team</Nav.Link>
                        <Nav.Link href="/contact" onClick={handleNavLinkClick}>Contact</Nav.Link>
                        <Nav.Link href="/apply-online" onClick={handleNavLinkClick}>Careers</Nav.Link>
                    </Nav>
                    <div className="navbar-actions">
                        <a href="/contact" className="button button-primary" onClick={handleNavLinkClick}>Book Consultation</a>
                    </div>
                </Navbar.Collapse>
            </Navbar>
        </header>
    );
};

export default NavBar;
