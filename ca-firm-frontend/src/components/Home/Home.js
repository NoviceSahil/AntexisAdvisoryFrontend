import React, { useEffect, useState } from 'react';
import './Home.css';
import { AuditIcon1, BookIcon3, BusinessIcon2, Tax4, Transfer5, Finance6, Warning7, Law8 } from '../../serviceicons/Icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';

const Home = () => {
    const [blogs, setBlogs] = useState([]);
    const [estimatorOptions, setEstimatorOptions] = useState({
        serviceAreas: [
            { id: 'service-area-1', label: 'Audit & Assurance', value: 'Audit & Assurance' },
            { id: 'service-area-2', label: 'GST Compliance', value: 'GST Compliance' },
            { id: 'service-area-3', label: 'Book Keeping', value: 'Book Keeping' },
            { id: 'service-area-4', label: 'Corporate Advisory', value: 'Corporate Advisory' }
        ],
        companySizes: [
            { id: 'company-size-1', label: 'Micro / Small', value: 'Micro / Small' },
            { id: 'company-size-2', label: 'Mid-size', value: 'Mid-size' },
            { id: 'company-size-3', label: 'Large', value: 'Large' }
        ],
        timelines: [
            { id: 'timeline-1', label: '4–6 weeks', value: '4–6 weeks' },
            { id: 'timeline-2', label: '6–12 weeks', value: '6–12 weeks' },
            { id: 'timeline-3', label: '12+ weeks', value: '12+ weeks' }
        ],
        budgets: [
            { id: 'budget-1', label: '₹0–₹50K', value: '₹0–₹50K' },
            { id: 'budget-2', label: '₹50K–₹1L', value: '₹50K–₹1L' },
            { id: 'budget-3', label: '₹1L–₹2L', value: '₹1L–₹2L' },
            { id: 'budget-4', label: '₹2L+', value: '₹2L+' }
        ]
    });
    const [estimatorSelection, setEstimatorSelection] = useState({
        serviceArea: 'Audit & Assurance',
        companySize: 'Micro / Small',
        timeline: '4–6 weeks',
        budget: '₹0–₹50K'
    });
    const navigate = useNavigate();

    const services = [
        {
            id: 1,
            title: 'Audit and Assurance',
            link: '/service/audit-and-assurance',
            icon: <AuditIcon1 className="service-icon" />,
            summary: 'Structured audit support for compliance, risk control and investor confidence.',
            highlights: ['Statutory audit', 'Internal controls', 'Financial transparency']
        },
        {
            id: 2,
            title: 'Business Advisory & Internal Audit',
            link: '/service/business-advisory-internal-audit',
            icon: <BusinessIcon2 className="service-icon" />,
            summary: 'High-impact advisory for governance, performance and growth.',
            highlights: ['Process optimisation', 'Risk reviews', 'Board-ready insights']
        },
        {
            id: 3,
            title: 'Book Keeping and Outsourcing',
            link: '/service/book-keeping-and-outsourcing',
            icon: <BookIcon3 className="service-icon" />,
            summary: 'Accurate bookkeeping and reporting, ready for audit and tax.',
            highlights: ['GST-ready records', 'Monthly reconciliations', 'Outsourced accounting']
        },
        {
            id: 4,
            title: 'Goods & Services Tax (GST)',
            link: '/service/good-services-tax',
            icon: <Tax4 className="service-icon" />,
            summary: 'Practical GST compliance and advisory for Indian businesses.',
            highlights: ['Return filing', 'Audit support', 'Tax strategy']
        },
        {
            id: 5,
            title: 'Transfer Pricing',
            link: '/service/transfer-pricing',
            icon: <Transfer5 className="service-icon" />,
            summary: 'Transfer pricing documentation and dispute-ready reporting.',
            highlights: ['Policy development', 'Benchmarking', 'Compliance review']
        },
        {
            id: 6,
            title: 'Corporate Financial Advisory',
            link: '/service/corporate-financial-advisory',
            icon: <Finance6 className="service-icon" />,
            summary: 'Strategic financial planning for capital, valuation and deals.',
            highlights: ['Fundraising support', 'Valuation analysis', 'Cash flow planning']
        },
        {
            id: 7,
            title: 'Risk Advisory',
            link: '/service/risk-advisory',
            icon: <Warning7 className="service-icon" />,
            summary: 'Risk assessments and controls that protect business value.',
            highlights: ['Risk frameworks', 'Control testing', 'Governance advisory']
        },
        {
            id: 8,
            title: 'Corporate Law & Secretarial Support',
            link: '/service/corporate-law-secretarial-support',
            icon: <Law8 className="service-icon" />,
            summary: 'Corporate compliance, filings and secretarial governance support.',
            highlights: ['ROC filings', 'Board documentation', 'Corporate filings']
        }
    ];

    const metrics = [
        { value: '10+', label: 'Years of service' },
        { value: '500+', label: 'Clients supported' },
        { value: 'Mumbai & Ludhiana', label: 'Regional offices' }
    ];

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.BLOGS);
                setBlogs(response.data);
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };
        fetchBlogs();
    }, []);

    useEffect(() => {
        const fetchEstimatorOptions = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.ESTIMATOR_OPTIONS);
                const grouped = response.data.reduce((acc, item) => {
                    const category = item.category || 'service_area';
                    if (!acc[category]) acc[category] = [];
                    acc[category].push(item);
                    return acc;
                }, {});

                setEstimatorOptions((prev) => ({
                    serviceAreas: grouped.service_area || prev.serviceAreas,
                    companySizes: grouped.company_size || prev.companySizes,
                    timelines: grouped.timeline || prev.timelines,
                    budgets: grouped.budget || prev.budgets
                }));
            } catch (error) {
                console.error('Error fetching estimator options:', error);
            }
        };
        fetchEstimatorOptions();
    }, []);

    const getServiceAreaBase = (serviceArea) => {
        switch (serviceArea) {
            case 'GST Compliance':
                return 30000;
            case 'Book Keeping':
                return 22000;
            case 'Corporate Advisory':
                return 70000;
            case 'Audit & Assurance':
            default:
                return 45000;
        }
    };

    const getCompanySizeMultiplier = (companySize) => {
        switch (companySize) {
            case 'Mid-size':
                return 1.3;
            case 'Large':
                return 1.7;
            case 'Micro / Small':
            default:
                return 1.0;
        }
    };

    const getTimelineMultiplier = (timeline) => {
        switch (timeline) {
            case '6–12 weeks':
                return 1.15;
            case '12+ weeks':
                return 1.3;
            case '4–6 weeks':
            default:
                return 1.0;
        }
    };

    const formatRange = (minValue, maxValue) => {
        const formatAmount = (value) => {
            if (value >= 100000) {
                return `₹${Math.round(value / 10000)}L`;
            }
            return `₹${Math.round(value / 1000)}K`;
        };

        return `${formatAmount(minValue)}–${formatAmount(maxValue)}`;
    };

    const calculateEstimatorRange = ({ serviceArea, companySize, timeline }) => {
        const base = getServiceAreaBase(serviceArea);
        const sizeMultiplier = getCompanySizeMultiplier(companySize);
        const timelineMultiplier = getTimelineMultiplier(timeline);

        const estimate = base * sizeMultiplier * timelineMultiplier;
        const low = Math.max(10000, estimate * 0.8);
        const high = Math.max(low + 5000, estimate * 1.2);

        return formatRange(low, high);
    };

    const handleBlogClick = (blogId) => {
        navigate(`/blog/${blogId}`);
    };

    return (
        <main className="home-wrapper">
            <section className="hero-panel">
                <div className="hero-grid">
                    <div className="hero-copy">
                        <span className="eyebrow">Trusted local chartered accountants</span>
                        <h1>Financial clarity for ambitious businesses in India</h1>
                        <p className="hero-description">
                            Antexis Advisory LLP helps growing companies manage audit, tax, compliance and corporate finance with confidence and clarity.
                        </p>
                        <div className="hero-actions">
                            <a href="/contact" className="button button-primary">Book a free consultation</a>
                            <a href="/services" className="button button-secondary">Explore services</a>
                        </div>
                        <div className="hero-metrics">
                            {metrics.map((metric) => (
                                <div key={metric.label} className="metric-card">
                                    <strong>{metric.value}</strong>
                                    <span>{metric.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="hero-visual" aria-hidden="true">
                        <div className="visual-surface">
                            <div className="visual-line" />
                            <div className="visual-dot-group">
                                <span />
                                <span />
                                <span />
                                <span />
                            </div>
                            <div className="visual-copy-block">
                                <div className="visual-pill">Client finance intelligence</div>
                                <div className="visual-pill secondary">Audit-ready insights</div>
                                <div className="visual-pill tertiary">Compliance simplified</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="trust-row">
                {metrics.map((item) => (
                    <div key={item.label} className="trust-item">
                        <span className="trust-value">{item.value}</span>
                        <span className="trust-label">{item.label}</span>
                    </div>
                ))}
            </section>

            <section className="service-overview">
                <div className="section-header">
                    <div>
                        <p className="section-eyebrow">Our core services</p>
                        <h2>Services designed to keep your business compliant, confident and growth-ready.</h2>
                    </div>
                    <p className="section-copy">
                        Navigate regulation, tax, audit and corporate finance with one trusted partner.
                    </p>
                </div>
                <div className="service-grid">
                    {services.map((service) => (
                        <a key={service.id} href={service.link} className="service-card">
                            <div className="service-card-header">
                                {service.icon}
                                <h3>{service.title}</h3>
                            </div>
                            <p>{service.summary}</p>
                            <ul className="service-highlights">
                                {service.highlights.map((highlight) => (
                                    <li key={highlight}>{highlight}</li>
                                ))}
                            </ul>
                            <span className="service-card-link">Learn more</span>
                        </a>
                    ))}
                </div>
            </section>

            <section className="about-split">
                <div className="about-card">
                    <span className="section-eyebrow">Why choose us</span>
                    <h2>Professional support with a modern, local approach.</h2>
                    <p>
                        We combine a disciplined assurance process with hands-on support for growing businesses in India. Our team delivers clarity, speed and direct access to senior advisors.
                    </p>
                    <ul className="about-list">
                        <li>Clear recommendations, not just compliance.</li>
                        <li>Senior-led teams on every engagement.</li>
                        <li>Local offices and pan-India service.</li>
                    </ul>
                    <a href="/contact" className="button button-secondary">Request a callback</a>
                </div>
                <div className="estimator-card">
                    <div className="estimator-header">
                        <span className="estimator-eyebrow">Cost estimator</span>
                        <h3>Find a quick budget range</h3>
                    </div>
                    <form className="estimator-form" onSubmit={(e) => e.preventDefault()}>
                        <label>
                            Service area
                            <select
                                aria-label="Select service area"
                                value={estimatorSelection.serviceArea}
                                onChange={(event) => setEstimatorSelection({ ...estimatorSelection, serviceArea: event.target.value })}
                            >
                                {estimatorOptions.serviceAreas.map((option) => (
                                    <option key={option.id} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Company size
                            <select
                                aria-label="Select company size"
                                value={estimatorSelection.companySize}
                                onChange={(event) => setEstimatorSelection({ ...estimatorSelection, companySize: event.target.value })}
                            >
                                {estimatorOptions.companySizes.map((option) => (
                                    <option key={option.id} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Timeline
                            <select
                                aria-label="Select timeline"
                                value={estimatorSelection.timeline}
                                onChange={(event) => setEstimatorSelection({ ...estimatorSelection, timeline: event.target.value })}
                            >
                                {estimatorOptions.timelines.map((option) => (
                                    <option key={option.id} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Budget
                            <select
                                aria-label="Select budget"
                                value={estimatorSelection.budget}
                                onChange={(event) => setEstimatorSelection({ ...estimatorSelection, budget: event.target.value })}
                            >
                                {estimatorOptions.budgets.map((option) => (
                                    <option key={option.id} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </label>
                        <div className="estimator-result">
                            <span>Suggested range</span>
                            <strong>{calculateEstimatorRange(estimatorSelection)}</strong>
                        </div>
                        <button type="button" className="button button-primary" onClick={() => navigate('/contact')}>
                            Book consultation
                        </button>
                    </form>
                </div>
            </section>

            <section className="blog-preview">
                <div className="section-header">
                    <div>
                        <p className="section-eyebrow">Insights & updates</p>
                        <h2>Latest articles from our advisory desk</h2>
                    </div>
                    <a href="/blog" className="button button-secondary">View all posts</a>
                </div>
                <div className="blog-grid">
                    {blogs.slice(0, 3).map((blog) => (
                        <button key={blog.id} className="blog-card" onClick={() => handleBlogClick(blog.id)}>
                            <div className="blog-card-top">
                                <div className="blog-dot" />
                                <h3>{blog.title}</h3>
                            </div>
                            <p>{blog.content?.substring(0, 110)}...</p>
                            <div className="blog-meta">{new Date(blog.created_at).toLocaleDateString()}</div>
                        </button>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Home;
