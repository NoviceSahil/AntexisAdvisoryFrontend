import React from 'react';
import './Service.css';

const TransferPricing = () => {
    return (
        <div className="service-detail">
            <div className="service-icon">
                <i className="fas fa-exchange-alt"></i>
                {/* or */}
                <i className="fas fa-sync"></i>
                {/* or */}
                <i className="fas fa-random"></i>
            </div>
            <h2>Transfer Pricing</h2>
            <p>
                We offer expert guidance on transfer pricing regulations to ensure compliance while optimizing your tax position.
                Our services include documentation preparation, benchmarking studies, and dispute resolution support.
            </p>
        </div>
    );
};

export default TransferPricing;
