import React, { useState, useEffect, navigate } from "react";
import axios from "axios";
import './SuperAdminDashboard.css';
import * as XLSX from 'xlsx';
import AdminModal from '../Modal/AdminModal'
import EstimatorOptionsManager from '../EstimatorOptionsManager';

const SuperAdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [newUserData, setNewUserData] = useState({
    username: '',
    password: '',
    role: 'admin'
  });
 // Add this state for blog management
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
        axios.get('http://localhost:5000/api/applications/all'),
        axios.get('http://localhost:5000/api/contact-submissions/all'),
        axios.get('http://localhost:5000/api/admin-users'),
        axios.get('http://localhost:5000/api/blogs/all')  
      ]);
      
      setApplications(appsRes.data);
      setContactSubmissions(contactRes.data);
      setAdminUsers(adminRes.data);
      setBlogs(blogsRes.data);  // Add this line
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
        const response = await axios.get('http://localhost:5000/api/visitor-stats');
        setVisitorStats(response.data);
      } catch (error) {
        console.error('Error fetching visitor stats:', error);
      }
    };
    fetchVisitorStats();
  }, []);
  
  const handleAddUser = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/admin-users', {
        username: userData.username,
        password: userData.password,
        role: userData.role
      });
      await fetchAllData(); // Refresh the list after adding
      setShowModal(false);
      setNewUserData({ username: '', password: '', role: 'admin' });
    } catch (error) {
      console.error('Error adding user:', error);
      alert('Failed to add user');
    }
  };

  const handleUpdateUser = async (id, userData) => {
    try {
      await axios.put(`http://localhost:5000/api/admin-users/${id}`, {
        username: userData.username,
        password: userData.password,
        role: userData.role
      });
      await fetchAllData(); // Refresh the list after updating
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
        await axios.delete(`http://localhost:5000/api/admin-users/${id}`);
        fetchAllData();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const toggleVisibility = async (id, type, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/${type}/${id}/visibility`, {
        isActive: !currentStatus
      });
      await fetchAllData(); // Refresh data after toggling
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm('Are you sure you want to permanently delete this record?')) {
      try {
        await axios.delete(`http://localhost:5000/api/${type}/${id}`);
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
  
      await axios.post('http://localhost:5000/api/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
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
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Super Admin Dashboard</h1>
      </div>
      
<div className="dashboard-section">
  <div className="section-header">
    <h2>Blog Management</h2>
    <button onClick={() => setShowBlogModal(true)} className="add-button">
      Add New Blog
    </button>
  </div>
  <table className="dashboard-table">
    <thead>
      <tr>
        <th>Title</th>
        <th>Author</th>
        <th>Created At</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
  {blogs.map((blog) => (
    <tr key={blog.id}>
      <td>{blog.title}</td>
      <td>{blog.author}</td>
      <td>{new Date(blog.created_at).toLocaleString()}</td>
      <td>
        <span className={`status-badge ${blog.is_active ? 'active' : 'inactive'}`}>
          {blog.is_active ? 'Active' : 'Hidden'}
        </span>
      </td>
      <td>
        <button
          onClick={() => toggleVisibility(blog.id, 'blogs', blog.is_active)}
          className={blog.is_active ? 'hide-button' : 'show-button'}
        >
          {blog.is_active ? 'Hide' : 'Show'}
        </button>
        <button
          onClick={() => handleDelete(blog.id, 'blogs')}
          className="delete-button"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
  </table>

  {showBlogModal && (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Blog Post</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleAddBlog();
        }}>
          <input
            type="text"
            placeholder="Title"
            value={blogData.title}
            onChange={(e) => setBlogData({...blogData, title: e.target.value})}
            required
          />
          <textarea
            placeholder="Content"
            value={blogData.content}
            onChange={(e) => setBlogData({...blogData, content: e.target.value})}
            required
          />
          <input
            type="text"
            placeholder="Author"
            value={blogData.author}
            onChange={(e) => setBlogData({...blogData, author: e.target.value})}
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBlogData({...blogData, image: e.target.files[0]})}
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setBlogData({...blogData, document: e.target.files[0]})}
          />
          <div className="modal-buttons">
            <button type="submit">Add Blog</button>
            <button type="button" onClick={() => setShowBlogModal(false)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Estimator Dropdown Values</h2>
        </div>
        <EstimatorOptionsManager />
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Job Applications</h2>
          <button 
            onClick={() => exportAllData(applications, "All_Job_Applications")} 
            className="export-button"
          >
            Export to Excel
          </button>
        </div>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Post Applied For</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} className={!app.is_active ? 'inactive-row' : ''}>
                <td>{app.name}</td>
                <td>{app.email}</td>
                <td>{app.phone}</td>
                <td>{app.post_applied_for}</td>
                <td>
  <a 
    href={`http://localhost:5000/api/download-resume/${app.resume_file_name}`} 
    className="download-link"
    target="_blank"
    rel="noopener noreferrer"
  >
    Download Resume
  </a>
</td>

                <td>
                  <span className={`status-badge ${app.is_active ? 'active' : 'inactive'}`}>
                    {app.is_active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => toggleVisibility(app.id, 'applications', app.is_active)}
                    className={app.is_active ? 'hide-button' : 'show-button'}
                  >
                    {app.is_active ? 'Hide' : 'Show'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Contact Submissions</h2>
          <button 
            onClick={() => exportAllData(contactSubmissions, "All_Contact_Submissions")} 
            className="export-button"
          >
            Export to Excel
          </button>
        </div>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contactSubmissions.map((submission) => (
              <tr key={submission.id} className={!submission.is_active ? 'inactive-row' : ''}>
                <td>{submission.name}</td>
                <td>{submission.email}</td>
                <td>{submission.subject}</td>
                <td>{submission.message}</td>
                <td>
                  <span className={`status-badge ${submission.is_active ? 'active' : 'inactive'}`}>
                    {submission.is_active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => toggleVisibility(submission.id, 'contact-submissions', submission.is_active)}
                    className={submission.is_active ? 'hide-button' : 'show-button'}
                  >
                    {submission.is_active ? 'Hide' : 'Show'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

   {/* Admin Users Management Section */}
   <div className="dashboard-section">
        <div className="section-header">
          <h2>Admin Users Management</h2>
          <button onClick={() => setShowModal(true)} className="add-button">
            Add New Admin
          </button>
        </div>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {adminUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
                <td>
                  <button 
                    onClick={() => {
                      setEditingUser(user);
                      setShowModal(true);
                    }} 
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                  <AdminModal 
      show={showModal}
      onClose={() => {
        setShowModal(false);
        setEditingUser(null);
      }}
      user={editingUser}
      onSubmit={(data) => {
        if (editingUser) {
          handleUpdateUser(editingUser.id, data);
        } else {
          handleAddUser(data);
        }
      }}
    />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <h2>Site Analytics</h2>
        </div>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Visits</h3>
            <p className="stat-number">{visitorStats.totalVisits}</p>
          </div>
          <div className="stat-card">
            <h3>Unique Visitors</h3>
            <p className="stat-number">{visitorStats.uniqueVisitors}</p>
          </div>
        </div>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Visits</th>
              <th>Unique Visitors</th>
            </tr>
          </thead>
          <tbody>
            {visitorStats.dailyStats?.map((stat) => (
              <tr key={stat.date}>
                <td>{new Date(stat.date).toLocaleDateString()}</td>
                <td>{stat.total_visits}</td>
                <td>{stat.unique_visitors}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default SuperAdminDashboard;
