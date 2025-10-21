import React from 'react';
import { Container } from 'react-bootstrap';
import { useSpring, animated } from 'react-spring';
import './Home.css';
import {AuditIcon1, BookIcon3, BusinessIcon2, Tax4, Transfer5, Finance6, Warning7, Law8 } from '../../serviceicons/Icons';
import axios from 'axios';
import { useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';


const Home = () => {
    const props = useSpring({ opacity: 1, from: { opacity: 0 }, config: { duration: 1000 } });
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();
    
    const services = [
        {
            id: 1,
            title: "Audit and Assurance",
            link: "/service/audit-and-assurance/",
            icon: <AuditIcon1 style={{ width: '40px', height: '40px', color: '#4682B4' }} />
        },
        {
            id: 2,
            title: "Business Advisory & Internal Audit",
            link: "/service/business-advisory-internal-audit/",
            icon: <BusinessIcon2 style={{ width: '40px', height: '40px', color: '#4682B4' }} />
        },
        {
            id: 3,
            title: "Book Keeping and Outsourcing",
            link: "/service/book-keeping-and-outsourcing/",
            icon: <BookIcon3 style={{ width: '40px', height: '40px', color: '#4682B4' }} />
        },
        {
            id: 4,
            title: "Goods & Services Tax (GST)",
            link: "/service/good-services-tax/",
            icon: <Tax4 style={{ width: '40px', height: '40px', color: '#4682B4' }} />
        },
        {
            id: 5,
            title: "Transfer Pricing",
            link: "/service/transfer-pricing/",
            icon: <Transfer5 style={{ width: '40px', height: '40px', color: '#4682B4' }} />
        },
        {
            id: 6,
            title: "Corporate Financial Advisory",
            link: "/service/corporate-financial-advisory/",
            icon: <Finance6 style={{ width: '40px', height: '40px', color: '#4682B4' }} />,
        },
        {
            id: 7,
            title: "Risk Advisory",
            link: "/service/risk-advisory/",
            icon: <Warning7 style={{ width: '40px', height: '40px', color: '#4682B4' }} />
        },
        {
            id: 8,
            title: "Corporate Law & Secretarial Support",
            link: "/service/corporate-law-secretarial-support/",
            icon: <Law8 style={{ width: '40px', height: '40px', color: '#4682B4' }} />,
            image: "/path/to/legal-support-image.jpg" 
        },
    ];
    const fadeIn = useSpring({ 
        from: { opacity: 0 }, 
        to: { opacity: 1 }, 
        config: { duration: 1000 } 
    });
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

    const handleBlogClick = (blogId) => {
        navigate(`/blog/${blogId}`);
    };
    

    return (
        <div className="home-wrapper">
            {/* Hero Section */}
            <section className="hero-banner fade-in-up">
                <div className="hero-content">
                    <h1 className="hero-title">Excellence in Financial Consulting</h1>
                    <p className="hero-subtitle">
                        Trusted advisors navigating the complexities of today's business landscape 
                        with integrity, expertise, and innovation
                    </p>
                    <div className="hero-buttons">
                        <a href="/contact" className="btn-custom btn-primary-custom">Get Started</a>
                        <a href="/services" className="btn-custom btn-primary-custom">Our Services</a>
                    </div>
                </div>
            </section>

        <Container className="home-container">
           <div className="content-grid fade-in-up">
    <div className="combined-section">
    <div className="articles-corner">
    <h2 className="section-title-small">
        <i className="fas fa-newspaper"></i> Latest Updates
    </h2>
    <div className="blogs-container">
        <div className="blogs-scroll-container">
            {blogs.slice(0, 3).map(blog => (
                <div 
                    key={blog.id} 
                    className="blog-card"
                    onClick={() => handleBlogClick(blog.id)}
                >
                    <div className="blog-header">
                        <div className="blog-icon">
                            {blog.image_url ? (
                                <img 
                                    src={`${API_ENDPOINTS.BLOG_IMAGES}/${blog.image_url}`}
                                    alt={blog.title}
                                    className="blog-thumbnail"
                                />
                            ) : (
                                <i className="fas fa-file-alt default-icon"></i>
                            )}
                        </div>
                        <div className="blog-text-content">
                            <h3 className="blog-title">{blog.title}</h3>
                            <p className="blog-preview">{blog.content.substring(0, 100)}...</p>
                        </div>
                    </div>
                    <div className="blog-footer">
                        <span className="blog-date">
                            <i className="far fa-calendar-alt"></i> {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    </div>
</div>


        
        <div className="about-content" id="about-us">
            <h1 className="section-title">About Us</h1>
            <p className="about-text">
                Our core strength lies in our exceptional execution capabilities, accessibility, and approachability with clients.
                We offer a comprehensive range of services globally, positioning ourselves as trusted advisors who navigate the complexities 
                of an ever-evolving compliance landscape.
            </p>
            <h5 className="key-highlights">Key Highlights:</h5>
            <ul className="key-points">
                <li>Highest standards of integrity and honesty.</li>
                <li>Top-notch service delivery with swift turnaround times.</li>
                <li>Extensive industry knowledge for sound business advice.</li>
                <li>Complete transparency in our processes.</li>
            </ul>
            {/* <div className="cta-section">
                <a className="cta-button" href="/contact">Contact Us</a>
            </div> */}
        </div>
    </div>
</div>
{/* Statistics Section */}
            <section className="stats-section fade-in-up">
                <div className="stats-container">
                    <div className="stat-item">
                        <span className="stat-number">8+</span>
                        <span className="stat-label">Years of Excellence</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">250+</span>
                        <span className="stat-label">Clients Served</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">98%</span>
                        <span className="stat-label">Client Satisfaction</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">25+</span>
                        <span className="stat-label">Expert Professionals</span>
                    </div>
                </div>
            </section>

            <div className="services-section mt-5 fade-in-up">
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
        </div>
    );
};

export default Home;
