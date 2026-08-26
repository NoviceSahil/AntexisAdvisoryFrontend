import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import Reveal from '../motion/Reveal';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const excerpt = (content, length = 160) => {
  const flat = content.replace(/\s+/g, ' ').trim();
  return flat.length > length ? `${flat.slice(0, length).trim()}…` : flat;
};

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
              <Reveal
                as="div"
                key={blog.id}
                className="blog-post-row"
                delay={i * 50}
                onClick={() => navigate(`/blog/${blog.id}`)}
                role="link"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/blog/${blog.id}`); }}
              >
                {blog.image_url && (
                  <span className="blog-post-thumb">
                    <img src={`${API_ENDPOINTS.BLOG_IMAGES}/${blog.image_url}`} alt="" />
                  </span>
                )}
                <span className="blog-post-body">
                  <span className="blog-post-meta">{blog.author} · {new Date(blog.created_at).toLocaleDateString()}</span>
                  <h3>{blog.title}</h3>
                  <p>{excerpt(blog.content)}</p>
                  <span className="blog-post-read">Read post <span className="card-arrow">→</span></span>
                </span>
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default BlogIndex;
