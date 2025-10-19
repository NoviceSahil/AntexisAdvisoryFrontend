import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BlogPage.css';

const BlogPage = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/blogs/${id}`);
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
                                src={`http://localhost:5000/uploads/blog-images/${blog.image_url}`}
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
                                href={`http://localhost:5000/uploads/blog-documents/${blog.document_url}`}
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
