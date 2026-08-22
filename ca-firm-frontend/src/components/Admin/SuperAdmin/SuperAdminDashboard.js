import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from 'xlsx';
import AdminModal from '../Modal/AdminModal';
import AdminShell from '../AdminShell';
import { API_ENDPOINTS, API_CONFIG, MULTIPART_CONFIG } from '../../../config/api';

const NAV_ITEMS = [
  { href: '#blogs', label: 'Blogs' },
  { href: '#applications', label: 'Applications' },
  { href: '#contacts', label: 'Contacts' },
  { href: '#users', label: 'Admin users' },
  { href: '#analytics', label: 'Analytics' }
];

const SuperAdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    author: '',
    image: null,
    document: null
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [appsRes, contactRes, adminRes, blogsRes] = await Promise.all([
        axios.get(API_ENDPOINTS.ADMIN_APPLICATIONS_ALL, API_CONFIG),
        axios.get(API_ENDPOINTS.ADMIN_CONTACTS_ALL, API_CONFIG),
        axios.get(API_ENDPOINTS.SUPER_ADMIN_USERS, API_CONFIG),
        axios.get(API_ENDPOINTS.ADMIN_BLOGS_ALL, API_CONFIG)
      ]);

      setApplications(appsRes.data);
      setContactSubmissions(contactRes.data);
      setAdminUsers(adminRes.data);
      setBlogs(blogsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const [visitorStats, setVisitorStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    dailyStats: []
  });

  useEffect(() => {
    const fetchVisitorStats = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.ADMIN_VISITOR_STATS, API_CONFIG);
        const rows = response.data || [];
        setVisitorStats({
          totalVisits: rows.reduce((sum, r) => sum + Number(r.total_visits || 0), 0),
          uniqueVisitors: rows.reduce((sum, r) => sum + Number(r.unique_visitors || 0), 0),
          dailyStats: rows
        });
      } catch (error) {
        console.error('Error fetching visitor stats:', error);
      }
    };
    fetchVisitorStats();
  }, []);

  const handleAddUser = async (userData) => {
    try {
      await axios.post(API_ENDPOINTS.SUPER_ADMIN_CREATE_USER, {
        username: userData.username,
        password: userData.password,
        role: userData.role
      }, API_CONFIG);
      await fetchAllData();
      setShowModal(false);
    } catch (error) {
      console.error('Error adding user:', error);
      alert(error.response?.data?.error || 'Failed to add user');
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      await axios.put(API_ENDPOINTS.SUPER_ADMIN_UPDATE_USER(id), {
        username: userData.username,
        password: userData.password,
        role: userData.role
      }, API_CONFIG);
      await fetchAllData();
      setShowModal(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(API_ENDPOINTS.SUPER_ADMIN_DELETE_USER(id), API_CONFIG);
        fetchAllData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const toggleApplicationVisibility = async (id, currentStatus) => {
    try {
      await axios.put(API_ENDPOINTS.ADMIN_APPLICATION_STATUS(id), { isActive: !currentStatus }, API_CONFIG);
      await fetchAllData();
    } catch (error) {
      console.error('Error toggling application visibility:', error);
    }
  };

  const toggleContactVisibility = async (id, currentStatus) => {
    try {
      await axios.put(API_ENDPOINTS.ADMIN_CONTACT_STATUS(id), { isActive: !currentStatus }, API_CONFIG);
      await fetchAllData();
    } catch (error) {
      console.error('Error toggling contact visibility:', error);
    }
  };

  const toggleBlogVisibility = async (id, currentStatus) => {
    try {
      await axios.put(API_ENDPOINTS.ADMIN_BLOG_VISIBILITY(id), { isActive: !currentStatus }, API_CONFIG);
      await fetchAllData();
    } catch (error) {
      console.error('Error toggling blog visibility:', error);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this record?')) {
      try {
        await axios.delete(API_ENDPOINTS.ADMIN_DELETE_BLOG(id), API_CONFIG);
        fetchAllData();
      } catch (error) {
        console.error('Error deleting record:', error);
      }
    }
  };

  const exportAllData = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, filename);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const handleAddBlog = async () => {
    try {
      const formData = new FormData();
      formData.append('title', blogData.title);
      formData.append('content', blogData.content);
      formData.append('author', blogData.author);
      if (blogData.image) {
        formData.append('image', blogData.image);
      }
      if (blogData.document) {
        formData.append('document', blogData.document);
      }

      await axios.post(API_ENDPOINTS.ADMIN_CREATE_BLOG, formData, MULTIPART_CONFIG);

      await fetchAllData();
      setShowBlogModal(false);
      setBlogData({
        title: '',
        content: '',
        author: '',
        image: null,
        document: null
      });
    } catch (error) {
      console.error('Error adding blog:', error);
      alert('Failed to add blog post');
    }
  };

  return (
    <AdminShell subtitle="Super Admin" navItems={NAV_ITEMS}>
      <div className="admin-head">
        <div>
          <h1>Super admin dashboard</h1>
          <p>Full visibility across blogs, applications, enquiries, admin accounts and site analytics.</p>
        </div>
      </div>

      <section className="admin-section" id="blogs">
        <div className="admin-section-head">
          <h2>Blog management</h2>
          <button type="button" onClick={() => setShowBlogModal(true)} className="btn btn-primary btn-sm">Add new blog</button>
        </div>
        <div className="admin-tbl-wrap">
          <table className="admin">
            <thead><tr><th>Title</th><th>Author</th><th>Created</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className={!blog.is_active ? 'inactive-row' : ''}>
                  <td data-label="Title">{blog.title}</td>
                  <td data-label="Author">{blog.author}</td>
                  <td data-label="Created">{new Date(blog.created_at).toLocaleDateString()}</td>
                  <td data-label="Status"><span className={`pill ${blog.is_active ? 'active' : 'inactive'}`}>{blog.is_active ? 'Active' : 'Hidden'}</span></td>
                  <td className="row-actions">
                    <button type="button" onClick={() => toggleBlogVisibility(blog.id, blog.is_active)}>{blog.is_active ? 'Hide' : 'Show'}</button>
                    <button type="button" onClick={() => handleDeleteBlog(blog.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && <tr><td colSpan={5} style={{ color: 'var(--ink-faint)' }}>No blog posts yet.</td></tr>}
            </tbody>
          </table>
        </div>

        {showBlogModal && (
          <div className="admin-modal-overlay" onClick={() => setShowBlogModal(false)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Add new blog post</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleAddBlog(); }}>
                <input type="text" placeholder="Title" value={blogData.title} onChange={(e) => setBlogData({ ...blogData, title: e.target.value })} required />
                <textarea placeholder="Content" rows={5} value={blogData.content} onChange={(e) => setBlogData({ ...blogData, content: e.target.value })} required />
                <input type="text" placeholder="Author" value={blogData.author} onChange={(e) => setBlogData({ ...blogData, author: e.target.value })} required />
                <input type="file" accept="image/*" onChange={(e) => setBlogData({ ...blogData, image: e.target.files[0] })} />
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setBlogData({ ...blogData, document: e.target.files[0] })} />
                <div className="admin-modal-actions">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowBlogModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Add blog</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      <section className="admin-section" id="applications">
        <div className="admin-section-head">
          <h2>Job applications</h2>
          <button type="button" onClick={() => exportAllData(applications, "All_Job_Applications")} className="btn btn-ghost btn-sm">Export to Excel</button>
        </div>
        <div className="admin-tbl-wrap">
          <table className="admin">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Post applied for</th><th>Resume</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className={!app.is_active ? 'inactive-row' : ''}>
                  <td data-label="Name">{app.name}</td>
                  <td data-label="Email">{app.email}</td>
                  <td data-label="Phone">{app.phone}</td>
                  <td data-label="Post applied for">{app.post_applied_for}</td>
                  <td data-label="Resume"><a href={API_ENDPOINTS.ADMIN_DOWNLOAD_RESUME(app.resume_file_name)} target="_blank" rel="noopener noreferrer">Download</a></td>
                  <td data-label="Status"><span className={`pill ${app.is_active ? 'active' : 'inactive'}`}>{app.is_active ? 'Active' : 'Hidden'}</span></td>
                  <td className="row-actions">
                    <button type="button" onClick={() => toggleApplicationVisibility(app.id, app.is_active)}>{app.is_active ? 'Hide' : 'Show'}</button>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && <tr><td colSpan={7} style={{ color: 'var(--ink-faint)' }}>No applications yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section" id="contacts">
        <div className="admin-section-head">
          <h2>Contact submissions</h2>
          <button type="button" onClick={() => exportAllData(contactSubmissions, "All_Contact_Submissions")} className="btn btn-ghost btn-sm">Export to Excel</button>
        </div>
        <div className="admin-tbl-wrap">
          <table className="admin">
            <thead><tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {contactSubmissions.map((submission) => (
                <tr key={submission.id} className={!submission.is_active ? 'inactive-row' : ''}>
                  <td data-label="Name">{submission.name}</td>
                  <td data-label="Email">{submission.email}</td>
                  <td data-label="Subject">{submission.subject}</td>
                  <td data-label="Message">{submission.message}</td>
                  <td data-label="Status"><span className={`pill ${submission.is_active ? 'active' : 'inactive'}`}>{submission.is_active ? 'Active' : 'Hidden'}</span></td>
                  <td className="row-actions">
                    <button type="button" onClick={() => toggleContactVisibility(submission.id, submission.is_active)}>{submission.is_active ? 'Hide' : 'Show'}</button>
                  </td>
                </tr>
              ))}
              {contactSubmissions.length === 0 && <tr><td colSpan={6} style={{ color: 'var(--ink-faint)' }}>No submissions yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section" id="users">
        <div className="admin-section-head">
          <h2>Admin users</h2>
          <button type="button" onClick={() => setShowModal(true)} className="btn btn-primary btn-sm">Add new admin</button>
        </div>
        <div className="admin-tbl-wrap">
          <table className="admin">
            <thead><tr><th>ID</th><th>Username</th><th>Role</th><th>Created</th><th></th></tr></thead>
            <tbody>
              {adminUsers.map((user) => (
                <tr key={user.id}>
                  <td data-label="ID">{user.id}</td>
                  <td data-label="Username">{user.username}</td>
                  <td data-label="Role"><span className="role-badge">{user.role}</span></td>
                  <td data-label="Created">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="row-actions">
                    <button type="button" onClick={() => { setEditingUser(user); setShowModal(true); }}>Edit</button>
                    <button type="button" onClick={() => handleDeleteUser(user.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdminModal
          show={showModal}
          onClose={() => { setShowModal(false); setEditingUser(null); }}
          user={editingUser}
          onSubmit={(data) => {
            if (editingUser) {
              handleUpdateUser(editingUser.id, data);
            } else {
              handleAddUser(data);
            }
          }}
        />
      </section>

      <section className="admin-section" id="analytics">
        <div className="admin-section-head">
          <h2>Site analytics</h2>
        </div>
        <div className="admin-stats">
          <div className="st"><span>Total visits</span><strong className="num">{visitorStats.totalVisits}</strong></div>
          <div className="st"><span>Unique visitors</span><strong className="num">{visitorStats.uniqueVisitors}</strong></div>
        </div>
        <div className="admin-tbl-wrap">
          <table className="admin">
            <thead><tr><th>Date</th><th>Visits</th><th>Unique visitors</th></tr></thead>
            <tbody>
              {visitorStats.dailyStats.map((stat) => (
                <tr key={stat.date}>
                  <td data-label="Date">{new Date(stat.date).toLocaleDateString()}</td>
                  <td data-label="Visits">{stat.total_visits}</td>
                  <td data-label="Unique visitors">{stat.unique_visitors}</td>
                </tr>
              ))}
              {visitorStats.dailyStats.length === 0 && <tr><td colSpan={3} style={{ color: 'var(--ink-faint)' }}>No visitor data yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
};

export default SuperAdminDashboard;
