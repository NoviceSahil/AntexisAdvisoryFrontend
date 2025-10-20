import React from 'react';
import './Service.css';

const CorporateFinancialAdvisory = () => {
    return (
        <div className="service-detail">
            <div className="service-icon">
                <i className="fas fa-chart-pie"></i>
                {/* or */}
                <i className="fas fa-coins"></i>
            </div>
            <h2>Corporate Financial Advisory</h2>
            <p>
                Our corporate financial advisory services help businesses make informed decisions regarding mergers, acquisitions,
                capital raising, and financial restructuring.
            </p>
        </div>
    );
};

export default CorporateFinancialAdvisory;
