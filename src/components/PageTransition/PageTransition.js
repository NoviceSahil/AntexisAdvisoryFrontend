import React, { useEffect, useState } from 'react';
import './PageTransition.css';

const PageTransition = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`page-transition ${isLoaded ? 'loaded' : ''}`}>
      {children}
    </div>
  );
};

export default PageTransition;
