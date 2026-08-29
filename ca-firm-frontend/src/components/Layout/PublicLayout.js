import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import axios from 'axios';
import NoticeTicker from '../motion/NoticeTicker';
import BackToTop from '../motion/BackToTop';
import Footer from '../Footer/Footer';
import { API_ENDPOINTS } from '../../config/api';
import logoMark from '../../assets/logo-mark.png';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
  { to: '/apply-online', label: 'Careers' }
];

const linkClass = ({ isActive }) => (isActive ? 'current' : undefined);

const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // The mobile dropdown panel is a normal block sibling below the sticky
  // header, not fixed/sticky itself - if the visitor is scrolled down the
  // page and opens it, it renders back at the page's natural top (right
  // after the header's un-stuck position) and never becomes visible.
  // Scrolling back up when opening puts the toggle - and the menu that
  // just appeared under it - back in view.
  const toggleMenu = () => {
    setMenuOpen((open) => {
      const next = !open;
      if (next) window.scrollTo({ top: 0, behavior: 'smooth' });
      return next;
    });
  };

  // Close the mobile menu automatically on navigation, otherwise it would
  // stay open over the next page.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Record the page view for the Super Admin "Site Analytics" section.
  // POST /api/track-visit has existed since the backend security pass, but
  // nothing was ever calling it - analytics showed zero visits forever
  // because half the feature was never wired up on the frontend.
  useEffect(() => {
    axios.post(API_ENDPOINTS.TRACK_VISIT, { page_url: location.pathname }).catch(() => {
      // Analytics is best-effort - a failed ping shouldn't affect the page.
    });
  }, [location.pathname]);

  return (
    <>
      <NoticeTicker />
      <header className="topnav">
        <div className="topnav-inner">
          <NavLink className="brand" to="/">
            <img src={logoMark} alt="" className="mark" />
            <span className="names">
              <strong>Ankita & Associates</strong>
              <span>Chartered Accountants</span>
            </span>
          </NavLink>

          <nav className="topnav-links">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="topnav-actions">
            <NavLink to="/contact" className="btn btn-primary btn-sm">Book Consultation</NavLink>
            <button
              type="button"
              className="topnav-toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              {menuOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className={`topnav-mobile${menuOpen ? ' open' : ''}`}>
        <div className="topnav-mobile-inner">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/contact" className="btn btn-primary btn-block">Book Consultation</NavLink>
        </div>
      </div>

      <main>
        <Outlet />
        <Footer />
      </main>
      <BackToTop />
    </>
  );
};

export default PublicLayout;
