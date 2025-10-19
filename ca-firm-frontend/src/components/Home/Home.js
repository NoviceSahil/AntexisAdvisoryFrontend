import React from 'react';
import { Container } from 'react-bootstrap';
import { useSpring, animated } from 'react-spring';
import './Home.css';
import {AuditIcon1, BookIcon3, BusinessIcon2, Tax4, Transfer5, Finance6, Warning7, Law8 } from '../../serviceicons/Icons';
import axios from 'axios';
import { useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const props = useSpring({ opacity: 1, from: { opacity: 0 }, config: { duration: 1000 } });
    const [blogs, setBlogs] = useState([]);
    const navigate = useNavigate();
    
    const services = [
        {
            id: 1,
            title: "Audit and Assurance",
            link: "/service/audit-and-assurance/",
            icon: <AuditIcon1 style={{ width: '40px', height: '40px', color: '#8d6e63' }} />
        },
        {
            id: 2,
            title: "Business Advisory & Internal Audit",
            link: "/service/business-advisory-internal-audit/",
            icon: <BusinessIcon2 style={{ width: '40px', height: '40px', color: '#8d6e63' }} />
        },
        {
            id: 3,
            title: "Book Keeping and Outsourcing",
            link: "/service/book-keeping-and-outsourcing/",
            icon: <BookIcon3 style={{ width: '40px', height: '40px', color: '#8d6e63' }} />
        },
        {
            id: 4,
            title: "Goods & Services Tax (GST)",
            link: "/service/good-services-tax/",
            icon: <Tax4 style={{ width: '40px', height: '40px', color: '#8d6e63' }} />
        },
        {
            id: 5,
            title: "Transfer Pricing",
            link: "/service/transfer-pricing/",
            icon: <Transfer5 style={{ width: '40px', height: '40px', color: '#8d6e63' }} />
        },
        {
            id: 6,
            title: "Corporate Financial Advisory",
            link: "/service/corporate-financial-advisory/",
            icon: <Finance6 style={{ width: '40px', height: '40px', color: '#8d6e63' }} />,
        },
        {
            id: 7,
            title: "Risk Advisory",
            link: "/service/risk-advisory/",
            icon: <Warning7 style={{ width: '40px', height: '40px', color: '#8d6e63' }} />
        },
        {
            id: 8,
            title: "Corporate Law & Secretarial Support",
            link: "/service/corporate-law-secretarial-support/",
            icon: <Law8 style={{ width: '40px', height: '40px', color: '#8d6e63' }} />,
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
                const response = await axios.get('http://localhost:5000/api/blogs');
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
        <Container className="home-container">
           <div className="content-grid">
    <div className="combined-section">
    <div className="articles-corner">
    <h2 className="section-title">
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
                                    src={`http://localhost:5000/uploads/blog-images/${blog.image_url}`}
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


        
        <div className="about-content">
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
            <div className="cta-section">
                <a className="cta-button" href="/contact">Contact Us</a>
            </div>
        </div>
    </div>
</div>

            <div className="services-section mt-5">
                <h2 className="services-title text-center">Our Services</h2>
                <div className="services-list">
                    {services.map(service => (
                        <div key={service.id} className="service-card">
                            {service.icon} 
                            {/* <img src={service.image} alt={service.title} className="service-image" /> */}
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

export default Home;
