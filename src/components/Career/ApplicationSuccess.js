import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ApplicationSuccess.css';

const ApplicationSuccess = () => {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate('/');
    }, 50000000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="success-container">
      <h2 className="success-message">Application Submitted Successfully!</h2>
      <p className="thank-you-message">
        Thank you for your interest. We will review your application and get back to you soon.
      </p>
      <p className="countdown-message">
        You will be redirected to the home page in {countdown} seconds.
      </p>
      <Link to="/" className="home-link">Return to Home</Link>
    </div>
  );
};

export default ApplicationSuccess;
