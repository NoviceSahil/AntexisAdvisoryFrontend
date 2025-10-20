import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import * as XLSX from 'xlsx';
import Modal from '../Modal/Modal';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [contactSubmissions, setContactSubmissions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [modalType, setModalType] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    author: '',
    image: null,
    document: null
  });

  const handleDeleteClick = (id, type) => {
    setSelectedId(id);
    setModalType(type);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicationsResponse = await axios.get('/api/applications');
        setApplications(applicationsResponse.data);

        const contactSubmissionsResponse = await axios.get('/api/contact-submissions');
        setContactSubmissions(contactSubmissionsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const exportJobApplications = () => {
    const worksheet = XLSX.utils.json_to_sheet(applications);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Job Applications");
    XLSX.writeFile(workbook, "job_applications.xlsx");
  };

  const exportContactSubmissions = () => {
    const worksheet = XLSX.utils.json_to_sheet(contactSubmissions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contact Submissions");
    XLSX.writeFile(workbook, "contact_submissions.xlsx");
  };


  const handleConfirmDelete = async () => {
    try {
      if (modalType === 'application') {
        await axios.put(`http://localhost:5000/api/applications/${selectedId}`);
        setApplications(applications.filter(app => app.id !== selectedId));
      } else {
        await axios.put(`/api/contact-submissions/${selectedId}`);
        setContactSubmissions(contactSubmissions.filter(sub => sub.id !== selectedId));
      }
    } catch (error) {
      console.error('Error archiving:', error);
    }
    setIsModalOpen(false);
  };

  

   useEffect(() => {
      fetchAllData();
    }, []);

  const fetchAllData = async () => {
    try {
      const [blogsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/blogs/all') 
      ]);

      setBlogs(blogsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
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

  const [showEditBlogModal, setShowEditBlogModal] = useState(false);
const [editBlogData, setEditBlogData] = useState({
    id: null,
    title: '',
    content: '',
    author: '',
    image: null,
    document: null,
   previousData: null // Store original data for logging
});

const handleEditClick = (blog) => {
  setEditBlogData({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      author: blog.author,
      image: null,
      document: null,
      previousData: {...blog} // Store original data
  });
  setShowEditBlogModal(true);
};

const handleEditBlog = async () => {
  try {
      const formData = new FormData();
      formData.append('title', editBlogData.title);
      formData.append('content', editBlogData.content);
      formData.append('author', editBlogData.author);
      formData.append('previousData', JSON.stringify(editBlogData.previousData)); // Ensure proper JSON stringification
      
      if (editBlogData.image) {
          formData.append('image', editBlogData.image);
      }
      if (editBlogData.document) {
          formData.append('document', editBlogData.document);
      }

      const response = await axios.put(`http://localhost:5000/api/blogs/${editBlogData.id}`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });
      
      if (response.data) {
          await fetchAllData();
          setShowEditBlogModal(false);
      }
  } catch (error) {
      console.error('Error updating blog:', error.response?.data || error.message);
      alert('Failed to update blog post: ' + (error.response?.data?.error || error.message));
  }
};



  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
      </div>

      <div className="dashboard-section">

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
        onClick={() => handleEditClick(blog)} 
        className="edit-button"
    >
        Edit
    </button>
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
                    onChange={(e) => setBlogData({ ...blogData, title: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Content"
                    value={blogData.content}
                    onChange={(e) => setBlogData({ ...blogData, content: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Author"
                    value={blogData.author}
                    onChange={(e) => setBlogData({ ...blogData, author: e.target.value })}
                    required
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBlogData({ ...blogData, image: e.target.files[0] })}
                  />
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setBlogData({ ...blogData, document: e.target.files[0] })}
                  />
                  <div className="modal-buttons">
                    <button type="submit">Add Blog</button>
                    <button type="button" onClick={() => setShowBlogModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

{showEditBlogModal && (
    <div className="modal-overlay">
        <div className="modal-content">
            <h2>Edit Blog Post</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                handleEditBlog();
            }}>
                <input
                    type="text"
                    placeholder="Title"
                    value={editBlogData.title}
                    onChange={(e) => setEditBlogData({...editBlogData, title: e.target.value})}
                    required
                />
                <textarea
                    placeholder="Content"
                    value={editBlogData.content}
                    onChange={(e) => setEditBlogData({...editBlogData, content: e.target.value})}
                    required
                />
                <input
                    type="text"
                    placeholder="Author"
                    value={editBlogData.author}
                    onChange={(e) => setEditBlogData({...editBlogData, author: e.target.value})}
                    required
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditBlogData({...editBlogData, image: e.target.files[0]})}
                />
                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => setEditBlogData({...editBlogData, document: e.target.files[0]})}
                />
                <div className="modal-buttons">
                    <button type="submit">Update Blog</button>
                    <button type="button" onClick={() => setShowEditBlogModal(false)}>Cancel</button>
                </div>
            </form>
        </div>
    </div>
)}


        </div>


        <h2>Job Applications</h2>
        <button onClick={exportJobApplications} className="export-button">Export to Excel</button>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Post Applied For</th>
              <th>Resume</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
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
                </td><td>
                  <button
                    onClick={() => handleDeleteClick(app.id, 'application')}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-section">
        <h2>Contact Submissions</h2>
        <button onClick={exportContactSubmissions} className="export-button">Export to Excel</button>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Message</th>
              <th>Submission Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {contactSubmissions.map((submission) => (
              <tr key={submission.id}>
                <td>{submission.name}</td>
                <td>{submission.email}</td>
                <td>{submission.subject}</td>
                <td>{submission.message}</td>
                <td>{new Date(submission.submission_date).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() => handleDeleteClick(submission.id, 'contact')}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          message={`Are you sure you want to archive this ${modalType}?`}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;