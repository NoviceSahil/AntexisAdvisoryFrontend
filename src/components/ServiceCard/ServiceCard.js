import React from 'react';
import IconAudit from '../IconAudit';

const ServiceCard = () => {
    return (
        <div className="service-card">
            <div className="icon-container">
                <IconAudit style={{ width: '40px', height: '100px', color: '#ffc107' }} />
            </div>
            <h5>Audit and Assurance</h5>
            <p>We provide comprehensive audit services to ensure compliance and transparency.</p>
        </div>
    );
};

export default ServiceCard;
