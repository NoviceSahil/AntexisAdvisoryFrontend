import React from 'react';
import { Container } from 'react-bootstrap';
import {AuditIcon1, BookIcon3, BusinessIcon2, Tax4, Transfer5, Finance6, Warning7, Law8 } from '../../serviceicons/Icons';
import '../Home/Home.css';

const Services = () => {

    const services = [
        {
            id: 1,
            title: "Audit and Assurance",
            link: "/service/audit-and-assurance/",
            icon: <AuditIcon1 style={{ width: '2.5rem', height: '2.5rem', color: '#4682B4' }} />
        },
        {
            id: 2,
            title: "Business Advisory & Internal Audit",
            link: "/service/business-advisory-internal-audit/",
            icon: <BusinessIcon2 style={{ width: '2.5rem', height: '2.5rem', color: '#4682B4' }} />
        },
        {
            id: 3,
            title: "Book Keeping and Outsourcing",
            link: "/service/book-keeping-and-outsourcing/",
            icon: <BookIcon3 style={{ width: '2.5rem', height: '2.5rem', color: '#4682B4' }} />
        },
        {
            id: 4,
            title: "Goods & Services Tax (GST)",
            link: "/service/good-services-tax/",
            icon: <Tax4 style={{ width: '2.5rem', height: '2.5rem', color: '#4682B4' }} />
        },
        {
            id: 5,
            title: "Transfer Pricing",
            link: "/service/transfer-pricing/",
            icon: <Transfer5 style={{ width: '2.5rem', height: '2.5rem', color: '#4682B4' }} />
        },
        {
            id: 6,
            title: "Corporate Financial Advisory",
            link: "/service/corporate-financial-advisory/",
            icon: <Finance6 style={{ width: '2.5rem', height: '2.5rem', color: '#4682B4' }} />,
        },
        {
            id: 7,
            title: "Risk Advisory",
            link: "/service/risk-advisory/",
            icon: <Warning7 style={{ width: '2.5rem', height: '2.5rem', color: '#4682B4' }} />
        },
        {
            id: 8,
            title: "Corporate Law & Secretarial Support",
            link: "/service/corporate-law-secretarial-support/",
            icon: <Law8 style={{ width: '2.5rem', height: '2.5rem', color: '#4682B4' }} />,
            image: "/path/to/legal-support-image.jpg" 
        },
    ];

    return (
            <Container>
                <div className="services-section">
                    <h2 className="services-title text-center">Our Services</h2>
                    <div className="services-list">
                        {services.map((service, index) => (
                            <div key={service.id} className="service-card service-card-animate" style={{ animationDelay: `${index * 0.1}s` }}>
                                {service.icon} 
                                <h5 className="service-title">
                                    <a href={service.link} className="link--external">{service.title}</a>
                                </h5>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
    );
};

export default Services;
