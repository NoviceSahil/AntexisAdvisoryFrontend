import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import Reveal from '../motion/Reveal';
import useDocumentTitle from '../../hooks/useDocumentTitle';

// This page didn't exist before - Home and the footer both linked to
// "/blog", but no route or component backed it, so it 404'd.
const BlogIndex = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useDocumentTitle('Blog');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.BLOGS);
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <>
      <section className="page-hero panel">
        <span className="eyebrow">Insights &amp; updates</span>
        <h1>From our advisory desk.</h1>
        <p>Practical notes on audit, tax and compliance for growing Indian businesses.</p>
      </section>

      <section className="panel" style={{ paddingBottom: '76px' }}>
        {loading ? (
          <p className="bull-empty">Loading…</p>
        ) : blogs.length === 0 ? (
          <p className="bull-empty">No posts published yet - check back soon.</p>
        ) : (
          <div className="blog-index-grid">
            {blogs.map((blog, i) => (
              <Reveal as="div" key={blog.id} className="bull-row" delay={i * 45}>
                <span className="bull-date">{new Date(blog.created_at).toLocaleDateString()}</span>
                <span className="bull-tag">{blog.author}</span>
                <button type="button" className="bull-title" onClick={() => navigate(`/blog/${blog.id}`)}>
                  {blog.title}
                </button>
                <span className="bull-arrow">→</span>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default BlogIndex;
