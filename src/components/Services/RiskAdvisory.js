import React from 'react';
import './Service.css';

const RiskAdvisory = () => {
    return (
        <div className="service-detail">
            <div className="service-icon">
                <i className="fas fa-shield-alt"></i>
                {/* or */}
                <i className="fas fa-exclamation-triangle"></i>
                {/* or */}
                <i className="fas fa-tasks"></i>
            </div>
            <h2>Risk Advisory</h2>
            <p>
                We provide risk advisory services that help organizations identify, assess, and mitigate risks effectively,
                ensuring sustainable growth and compliance with regulations.
            </p>
        </div>
    );
};

export default RiskAdvisory;
