import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const FALLBACK_NOTICES = [
  'Check our compliance calendar for upcoming GST, income tax and ROC due dates.'
];

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

const reduceMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Rotating notice bar shown at the top of every public page - pulls its
// messages from the real, admin-managed compliance calendar
// (GET /api/compliance) instead of a hardcoded list, so updating one place
// (the admin dashboard) keeps both in sync.
const NoticeTicker = () => {
  const [notices, setNotices] = useState(FALLBACK_NOTICES);
  const [idx, setIdx] = useState(0);
  const [showing, setShowing] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.COMPLIANCE_DATES);
        const upcoming = response.data
          .slice(0, 5)
          .map((entry) => `${entry.title} due ${formatDate(entry.due_date)}.`);
        if (upcoming.length > 0) setNotices(upcoming);
      } catch (error) {
        console.error('Error fetching compliance notices:', error);
      }
    };
    fetchNotices();
  }, []);

  // Every 4.5s, fade the current message out.
  useEffect(() => {
    if (reduceMotion() || notices.length < 2) return undefined;
    const id = setInterval(() => setShowing(false), 4500);
    return () => clearInterval(id);
  }, [notices]);

  // Once faded out, swap to the next message and fade back in - kept as
  // one persistent element so the opacity transition actually plays,
  // instead of remounting a new node already in its "visible" state.
  useEffect(() => {
    if (showing) return undefined;
    const t = setTimeout(() => {
      setIdx((i) => (i + 1) % notices.length);
      setShowing(true);
    }, 550);
    return () => clearTimeout(t);
  }, [showing, notices]);

  return (
    <div className="notice-ticker" role="status" aria-live="polite">
      <span className="notice-kind">
        <span className="notice-dot" />
        Notices
      </span>
      <div className="notice-track">
        <span className={`notice-item${showing ? ' showing' : ''}`}>{notices[idx]}</span>
      </div>
      <Link to="/compliance-calendar" className="notice-link">
        View compliance calendar →
      </Link>
    </div>
  );
};

export default NoticeTicker;
