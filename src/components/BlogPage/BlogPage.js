import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BlogPage.css';
import { API_ENDPOINTS } from '../../config/api';

const BlogPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.BLOG_BY_ID(id));
                setBlog(response.data);
            } catch (error) {
                console.error('Error fetching blog:', error);
            }
        };
        fetchBlog();
    }, [id]);

    if (!blog) return <div>Loading...</div>;

    return (
        <div className="blog-page">
            <div className="blog-content">
                <h1>{blog.title}</h1>
                <div className="blog-layout">
                    <div className="blog-image-container">
                        {blog.image_url && (
                            <img 
                                src={`${API_ENDPOINTS.BLOG_IMAGES}/${blog.image_url}`}
                                alt={blog.title}
                                className="blog-image"
                            />
                        )}
                    </div>
                    <div className="blog-main-content">
                        <div className="blog-meta">
                            <span>By {blog.author}</span>
                            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="blog-text">
                            {blog.content}
                        </div>
                        {blog.document_url && (
                            <a 
                                href={`${API_ENDPOINTS.BLOG_DOCUMENTS}/${blog.document_url}`}
                                className="document-link"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <i className="fas fa-file-pdf"></i> Download Source Document
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
