import React from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import './NavBar.css';
import caIcon from '../../assets/icai.png';
import { FaEnvelope, FaPhone } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const NavBar = ({ setIsAdmin, setIsSuperAdmin }) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.removeItem('isAdmin');
        sessionStorage.removeItem('isSuperAdmin');
        setIsAdmin(false);
        setIsSuperAdmin(false);
        navigate('/');
      };
    
    return (
        <Navbar expand="lg" className="navbar-custom">
            <Navbar.Brand href="/" className="navbar-title">
                <div className="brand-container"> 
                    <img src={caIcon} alt="CA Icon" className="ca-icon" />
                    Antexis Advisory 
                </div>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <div className="contact-info">
                    <div className="contact-card">
                        <a href="mailto:info@example.com" className="contact-item">
                            <FaEnvelope /> Email: ankitaarora949@gmail.com</a>
                        <span> | </span>
                            <FaPhone /> Phone: +91 9671647839
                    </div>
                </div>

{/* <div className="admin-login">
      {(sessionStorage.getItem('isAdmin') === 'true' || 
        sessionStorage.getItem('isSuperAdmin') === 'true') ? (
        <button onClick={handleLogout} className="logout-button">Logout</button>
      ) : (
        <a href="/admin/login" className="admin-login-link">AdminLogin</a>
      )}
    </div> */}

                <div className="tabs-container">
                    <Nav className="me-auto">
                        <Nav.Link href="/">HOME</Nav.Link>
                        {/* <NavDropdown title="ABOUT US" id="about-dropdown">
                            {/* <NavDropdown.Item href="/about">About Us</NavDropdown.Item> }
                            <NavDropdown.Item href="/team">Team</NavDropdown.Item>
                            <NavDropdown.Item href="/affiliation">Affiliation</NavDropdown.Item>
                        </NavDropdown> */}
                        <NavDropdown title="SERVICES" id="services-dropdown">
                            <NavDropdown.Item href="/service/audit-and-assurance">Audit and Assurance</NavDropdown.Item>
                            <NavDropdown.Item href="/service/business-advisory-internal-audit">Business Advisory & Internal Audit</NavDropdown.Item>
                            <NavDropdown.Item href="/service/book-keeping-and-outsourcing">Book Keeping and Outsourcing</NavDropdown.Item>
                            <NavDropdown.Item href="/service/good-services-tax">Goods & Services Tax (GST)</NavDropdown.Item>
                            <NavDropdown.Item href="/service/transfer-pricing">Transfer Pricing</NavDropdown.Item>
                            <NavDropdown.Item href="/service/corporate-financial-advisory">Corporate Financial Advisory</NavDropdown.Item>
                            <NavDropdown.Item href="/service/risk-advisory">Risk Advisory</NavDropdown.Item>
                            <NavDropdown.Item href="/service/corporate-law-secretarial-support">Corporate Law & Secretarial Support</NavDropdown.Item>
                        </NavDropdown>
                        {/* <Nav.Link href="/industries">Industries</Nav.Link> */}
                        <NavDropdown title="CAREER" id="services-dropdown">
                        <NavDropdown.Item href="/apply-online">Apply Online</NavDropdown.Item>
                        </NavDropdown>
                        
                        <Nav.Link href="/contact">CONTACT US</Nav.Link>
                    </Nav>
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavBar;
