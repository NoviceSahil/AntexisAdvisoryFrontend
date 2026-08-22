import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const BlogPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [notFound, setNotFound] = useState(false);
  useDocumentTitle(blog?.title);

  useEffect(() => {
    setBlog(null);
    setNotFound(false);
    const fetchBlog = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.BLOG_BY_ID(id));
        setBlog(response.data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setNotFound(true);
      }
    };
    fetchBlog();
  }, [id]);

  if (notFound) {
    return (
      <div className="panel success-shell">
        <h1>Post not found.</h1>
        <p>This post may have been removed or is no longer available.</p>
        <Link to="/blog" className="btn btn-ghost">Back to blog</Link>
      </div>
    );
  }

  if (!blog) return <div className="panel" style={{ paddingTop: '76px' }}>Loading…</div>;

  return (
    <>
      <div className="panel crumb">
        <Link to="/blog">Blog</Link> / <strong>{blog.title}</strong>
      </div>
      <section className="blog-detail-hero panel">
        <h1>{blog.title}</h1>
        <div className="blog-detail-meta">
          <span>By {blog.author}</span>
          <span>{new Date(blog.created_at).toLocaleDateString()}</span>
        </div>
      </section>

      <div className="panel">
        {blog.image_url && (
          <img
            src={`${API_ENDPOINTS.BLOG_IMAGES}/${blog.image_url}`}
            alt={blog.title}
            className="blog-detail-img"
          />
        )}
        <div className="blog-detail-body">{blog.content}</div>
        {blog.document_url && (
          <a
            href={`${API_ENDPOINTS.BLOG_DOCUMENTS}/${blog.document_url}`}
            className="blog-doc-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download source document →
          </a>
        )}
      </div>
    </>
  );
};

export default BlogPage;
