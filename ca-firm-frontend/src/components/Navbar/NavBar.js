import React, { useRef, useEffect, useState } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './NavBar.css';
import caIcon from '../../assets/icai.png';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const NavBar = ({ setIsAdmin, setIsSuperAdmin }) => {
    const navigate = useNavigate();
    const navbarRef = useRef(null);
    const [expanded, setExpanded] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem('isAdmin');
        sessionStorage.removeItem('isSuperAdmin');
        setIsAdmin(false);
        setIsSuperAdmin(false);
        navigate('/');
    };

    // Close menu when clicking outside
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

    // Close menu when a link is clicked
    const handleNavLinkClick = () => {
        setExpanded(false);
    };
    
    return (
        <Navbar 
            expand="lg" 
            className="navbar-custom" 
            ref={navbarRef}
            expanded={expanded}
            onToggle={setExpanded}
        >
            <Navbar.Brand href="/" className="navbar-title" onClick={handleNavLinkClick}>
                <div className="brand-container"> 
                    <img src={caIcon} alt="CA Icon" className="ca-icon" />
                    Antexis Advisory LLP
                </div>
            </Navbar.Brand>
            
            
            
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                {/* Contact info for mobile - shown in collapse menu */}
                <div className="contact-info-mobile">
                    <div className="contact-card">
                        <a href="mailto:office@antexisadvisory.com" className="contact-item">
                            <FaEnvelope className="contact-icon" />
                            <span className="contact-text">office@antexisadvisory.com</span>
                        </a>
                    </div>
                </div>

                <div className="tabs-container">
                    <Nav className="me-auto">
                        <Nav.Link href="/" onClick={handleNavLinkClick}>HOME</Nav.Link>
                        {/* <NavDropdown title="ABOUT US" id="about-dropdown">
                            {/* <NavDropdown.Item href="/about">About Us</NavDropdown.Item> }
                            <NavDropdown.Item href="/team">Team</NavDropdown.Item>
                            <NavDropdown.Item href="/affiliation">Affiliation</NavDropdown.Item>
                        </NavDropdown> */}
                        <NavDropdown title="SERVICES" id="services-dropdown">
                            <NavDropdown.Item href="/service/audit-and-assurance" onClick={handleNavLinkClick}>Audit and Assurance</NavDropdown.Item>
                            <NavDropdown.Item href="/service/business-advisory-internal-audit" onClick={handleNavLinkClick}>Business Advisory & Internal Audit</NavDropdown.Item>
                            <NavDropdown.Item href="/service/book-keeping-and-outsourcing" onClick={handleNavLinkClick}>Book Keeping and Outsourcing</NavDropdown.Item>
                            <NavDropdown.Item href="/service/good-services-tax" onClick={handleNavLinkClick}>Goods & Services Tax (GST)</NavDropdown.Item>
                            <NavDropdown.Item href="/service/transfer-pricing" onClick={handleNavLinkClick}>Transfer Pricing</NavDropdown.Item>
                            <NavDropdown.Item href="/service/corporate-financial-advisory" onClick={handleNavLinkClick}>Corporate Financial Advisory</NavDropdown.Item>
                            <NavDropdown.Item href="/service/risk-advisory" onClick={handleNavLinkClick}>Risk Advisory</NavDropdown.Item>
                            <NavDropdown.Item href="/service/corporate-law-secretarial-support" onClick={handleNavLinkClick}>Corporate Law & Secretarial Support</NavDropdown.Item>
                        </NavDropdown>
                        {/* <Nav.Link href="/industries">Industries</Nav.Link> */}
                        <NavDropdown title="CAREER" id="services-dropdown">
                        <NavDropdown.Item href="/apply-online" onClick={handleNavLinkClick}>Apply Online</NavDropdown.Item>
                        </NavDropdown>
                        
                        <Nav.Link href="/contact" onClick={handleNavLinkClick}>CONTACT US</Nav.Link>
                    </Nav>
                </div>
                {/* Contact card positioned outside collapse for desktop */}
            <div className="contact-info-desktop">
                <div className="contact-card">
                    <a href="mailto:office@antexisadvisory.com" className="contact-item">
                        <FaEnvelope className="contact-icon" />
                        <span className="contact-text">office@antexisadvisory.com</span>
                    </a>
                </div>
            </div>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavBar;
