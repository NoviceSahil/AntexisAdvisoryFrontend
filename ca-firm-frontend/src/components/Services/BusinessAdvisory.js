import React from 'react';
import './Service.css';

const BusinessAdvisory = () => {
    return (
        <div className="service-detail">
            <div className="service-icon">
                <i className="fas fa-handshake"></i>
                       

                       
                {/* or */}
                <i className="fas fa-briefcase"></i>
            </div>
            <h2>Business Advisory & Internal Audit</h2>
            <p>
                We provide strategic business advisory services that help you navigate complex business challenges. 
                Our internal audit services ensure that your operations are effective and compliant with regulations.
            </p>
            <p>
                Our experts work closely with you to identify risks and implement effective controls, enhancing your overall business performance.
            </p>
        </div>
    );
};

export default BusinessAdvisory;
