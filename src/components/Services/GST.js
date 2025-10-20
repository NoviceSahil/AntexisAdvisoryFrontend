import React from 'react';
import './Service.css';

const GST = () => {
    return (
        <div className="service-detail">
            <div className="service-icon">
                <i className="fas fa-receipt"></i>
                {/* or */}
                <i className="fas fa-percentage"></i>
                {/* or */}
                <i className="fas fa-file-invoice-dollar"></i>
            </div>
            <h2>Goods & Services Tax (GST)</h2>
            <p>
                Our GST services provide comprehensive support for compliance, planning, and advisory related to GST regulations.
                We help you navigate the complexities of GST to minimize liabilities and maximize benefits.
            </p>
        </div>
    );
};

export default GST;
