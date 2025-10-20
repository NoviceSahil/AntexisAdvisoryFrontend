import React, { useState } from 'react';
import axios from 'axios';
import './Contact.css';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';

const Contact = ({setIsSubmitted}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response= await axios.post(API_ENDPOINTS.CONTACT, {name,email,subject,message });
            setIsSubmitted(true);
            console.log({ response });
            navigate('/contact-success');
          }
        catch(error){
            console.error('Error submitting form:', error);
            alert('Error sending message. Please try again.');
        } 
    };

    return (
        <div className="contact-container">
            <div className="banner-heading our-expertise">
                <div className="featured-heading">
                    <h2 className="all-heading">Your <strong>Query</strong></h2>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="contact-form mt-4">
                <h2>Contact Us</h2>
                <input 
                    type="text" 
                    placeholder="Your Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    className="form-control"
                />
                <input 
                    type="email" 
                    placeholder="Your Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="form-control"
                />
                <input
                    placeholder="Subject" 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    required 
                    className="form-control"
                />
                <textarea 
                    placeholder="Your Message" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    required 
                    className="form-control"
                />
                <button type="submit" className="btn btn-custom">Send Message</button>
            </form>
        </div>
    );
};

export default Contact;
