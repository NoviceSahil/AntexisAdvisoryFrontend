import React from 'react';
import './Affiliation.css';

const Affiliation = () => {
    const affiliations = [
        {
            id: 1,
            name: "Institute of Chartered Accountants of India",
            logo: "/path/to/icai-logo.png", 
        },
        {
            id: 2,
            name: "International Federation of Accountants",
            logo: "/path/to/ifac-logo.png",
        },
        {
            id: 3,
            name: "Chartered Institute of Management Accountants",
            logo: "/path/to/cima-logo.png", 
        },
    ];

    return (
        <div className="affiliation-section">
            <h2 className="affiliation-title">Our Affiliations</h2>
            <div className="affiliation-list">
                {affiliations.map(affiliate => (
                    <div key={affiliate.id} className="affiliation-card">
                        <img src={affiliate.logo} alt={affiliate.name} className="affiliation-logo" />
                        <h5 className="affiliation-name">{affiliate.name}</h5>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Affiliation;
