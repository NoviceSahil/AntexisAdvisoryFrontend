import React from 'react';
import './Service.css';

const CorporateLaw = () => {
    return (
        <div className="service-detail">
            <div className="service-icon">
                <i className="fas fa-balance-scale"></i>
                {/* or */}
                <i className="fas fa-gavel"></i>
                {/* or */}
                <i className="fas fa-file-contract"></i>
            </div>
            <h2>Corporate Law & Secretarial Support</h2>
            <p>
                Our corporate law services cover a wide range of legal matters including compliance, corporate governance,
                and secretarial support to ensure that your business operates within the legal framework.
            </p>
        </div>
    );
};

export default CorporateLaw;
