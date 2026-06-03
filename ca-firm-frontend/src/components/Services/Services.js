import React from 'react';
import { Link } from 'react-router-dom';
import { AuditIcon1, BookIcon3, BusinessIcon2, Tax4, Transfer5, Finance6, Warning7, Law8 } from '../../serviceicons/Icons';
import './Services.css';

const Services = () => {
    const services = [
        {
            id: 1,
            title: 'Audit and Assurance',
            link: '/service/audit-and-assurance',
            icon: <AuditIcon1 className="service-icon" />,
            summary: 'Independent financial assurance for compliance, investors and regulators.',
            highlights: ['Statutory audits', 'Internal control testing', 'Transparent reporting']
        },
        {
            id: 2,
            title: 'Business Advisory & Internal Audit',
            link: '/service/business-advisory-internal-audit',
            icon: <BusinessIcon2 className="service-icon" />,
            summary: 'Actionable guidance for governance, risk and operational improvement.',
            highlights: ['Process optimisation', 'Risk advisory', 'Performance improvement']
        },
        {
            id: 3,
            title: 'Book Keeping and Outsourcing',
            link: '/service/book-keeping-and-outsourcing',
            icon: <BookIcon3 className="service-icon" />,
            summary: 'Accurate books, timely reconciliations and audit-ready records.',
            highlights: ['Daily bookkeeping', 'Monthly close', 'GST-ready records']
        },
        {
            id: 4,
            title: 'Goods & Services Tax (GST)',
            link: '/service/good-services-tax',
            icon: <Tax4 className="service-icon" />,
            summary: 'GST compliance support with practical advice for Indian businesses.',
            highlights: ['Return filing', 'GST audit support', 'Tax structuring']
        },
        {
            id: 5,
            title: 'Transfer Pricing',
            link: '/service/transfer-pricing',
            icon: <Transfer5 className="service-icon" />,
            summary: 'Transfer pricing documentation and international compliance support.',
            highlights: ['Policy papers', 'Benchmarking', 'Regulatory readiness']
        },
        {
            id: 6,
            title: 'Corporate Financial Advisory',
            link: '/service/corporate-financial-advisory',
            icon: <Finance6 className="service-icon" />,
            summary: 'Financial planning and advisory for capital, valuation and deals.',
            highlights: ['Fundraising support', 'Valuation', 'Cash flow strategy']
        },
        {
            id: 7,
            title: 'Risk Advisory',
            link: '/service/risk-advisory',
            icon: <Warning7 className="service-icon" />,
            summary: 'Risk assessments, governance reviews and confidence-building controls.',
            highlights: ['Risk frameworks', 'Control testing', 'Compliance reviews']
        },
        {
            id: 8,
            title: 'Corporate Law & Secretarial Support',
            link: '/service/corporate-law-secretarial-support',
            icon: <Law8 className="service-icon" />,
            summary: 'Corporate compliance, filings and secretarial governance support.',
            highlights: ['ROC filings', 'Board minutes', 'Corporate secretarial']
        }
    ];

    return (
        <main className="services-page">
            <section className="services-hero">
                <div className="services-hero-copy">
                    <p className="section-eyebrow">Practice areas</p>
                    <h1>Services built for compliance, finance and business growth.</h1>
                    <p className="section-description">
                        Explore our practice areas and find the advisory support your business needs.
                    </p>
                </div>
            </section>

            <section className="services-grid-container">
                {services.map((service) => (
                    <Link key={service.id} to={service.link} className="services-card">
                        <div className="services-card-top">
                            {service.icon}
                            <h3>{service.title}</h3>
                        </div>
                        <p>{service.summary}</p>
                        <ul>
                            {service.highlights.map((highlight) => (
                                <li key={highlight}>{highlight}</li>
                            ))}
                        </ul>
                        <span className="services-link">Learn more</span>
                    </Link>
                ))}
            </section>
        </main>
    );
};

export default Services;
