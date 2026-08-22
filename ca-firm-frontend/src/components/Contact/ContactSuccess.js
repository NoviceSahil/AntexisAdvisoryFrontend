import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ContactSuccess = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="panel success-shell">
      <span className="eyebrow">Message sent</span>
      <h1>Query submitted successfully.</h1>
      <p>Thank you for your message - we'll get back to you within one business day.</p>
      <p className="success-count">Redirecting to the home page in {countdown}s.</p>
      <Link to="/" className="btn btn-ghost">Return to home</Link>
    </div>
  );
};

export default ContactSuccess;
