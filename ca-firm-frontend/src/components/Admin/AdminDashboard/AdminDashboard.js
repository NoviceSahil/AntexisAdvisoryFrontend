import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import Modal from '../Modal/Modal';
import AdminShell from '../AdminShell';
import { API_ENDPOINTS, API_CONFIG, MULTIPART_CONFIG } from '../../../config/api';

const NAV_ITEMS = [
  { href: '#blogs', label: 'Blogs' },
  { href: '#compliance', label: 'Compliance' },
  { href: '#applications', label: 'Applications' },
  { href: '#contacts', label: 'Contacts' }
];

const emptyCompliance = { category: '', title: '', due_date: '', cadence: '' };

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
  const [complianceDates, setComplianceDates] = useState([]);
  const [showComplianceModal, setShowComplianceModal] = useState(false);
  const [complianceData, setComplianceData] = useState(emptyCompliance);
  const [showEditComplianceModal, setShowEditComplianceModal] = useState(false);
  const [editComplianceData, setEditComplianceData] = useState(emptyCompliance);

  const handleDeleteClick = (id, type) => {
    setSelectedId(id);
    setModalType(type);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicationsResponse = await axios.get(API_ENDPOINTS.ADMIN_APPLICATIONS, API_CONFIG);
        setApplications(applicationsResponse.data);

        const contactSubmissionsResponse = await axios.get(API_ENDPOINTS.ADMIN_CONTACTS, API_CONFIG);
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

  // Note: there's no hard-delete for applications/contact enquiries on the
  // backend - both endpoints archive (is_active = false) so candidate/
  // enquirer PII isn't destructively removed by a misclick.
  const handleConfirmDelete = async () => {
    try {
      if (modalType === 'application') {
        await axios.put(API_ENDPOINTS.ADMIN_APPLICATION_STATUS(selectedId), { isActive: false }, API_CONFIG);
        setApplications(applications.filter(app => app.id !== selectedId));
      } else {
        await axios.put(API_ENDPOINTS.ADMIN_CONTACT_STATUS(selectedId), { isActive: false }, API_CONFIG);
        setContactSubmissions(contactSubmissions.filter(sub => sub.id !== selectedId));
      }
    } catch (error) {
      console.error('Error archiving:', error);
    }
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchAllData();
    fetchCompliance();
  }, []);

  const fetchAllData = async () => {
    try {
      const blogsRes = await axios.get(API_ENDPOINTS.ADMIN_BLOGS_ALL, API_CONFIG);
      setBlogs(blogsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchCompliance = async () => {
    try {
      const res = await axios.get(API_ENDPOINTS.ADMIN_COMPLIANCE_ALL, API_CONFIG);
      setComplianceDates(res.data);
    } catch (error) {
      console.error('Error fetching compliance dates:', error);
    }
  };

  const handleAddCompliance = async () => {
    try {
      await axios.post(API_ENDPOINTS.ADMIN_CREATE_COMPLIANCE, complianceData, API_CONFIG);
      await fetchCompliance();
      setShowComplianceModal(false);
      setComplianceData(emptyCompliance);
    } catch (error) {
      console.error('Error adding compliance date:', error);
      alert(error.response?.data?.errors?.[0]?.msg || 'Failed to add compliance date');
    }
  };

  const handleEditComplianceClick = (entry) => {
    setEditComplianceData({
      id: entry.id,
      category: entry.category,
      title: entry.title,
      due_date: entry.due_date?.slice(0, 10) || '',
      cadence: entry.cadence || ''
    });
    setShowEditComplianceModal(true);
  };

  const handleEditCompliance = async () => {
    try {
      await axios.put(API_ENDPOINTS.ADMIN_UPDATE_COMPLIANCE(editComplianceData.id), editComplianceData, API_CONFIG);
      await fetchCompliance();
      setShowEditComplianceModal(false);
    } catch (error) {
      console.error('Error updating compliance date:', error);
      alert('Failed to update compliance date');
    }
  };

  const toggleComplianceVisibility = async (id, currentStatus) => {
    try {
      await axios.put(API_ENDPOINTS.ADMIN_COMPLIANCE_VISIBILITY(id), { isActive: !currentStatus }, API_CONFIG);
      await fetchCompliance();
    } catch (error) {
      console.error('Error toggling compliance visibility:', error);
    }
  };

  const handleDeleteCompliance = async (id) => {
    if (window.confirm('Delete this compliance date permanently?')) {
      try {
        await axios.delete(API_ENDPOINTS.ADMIN_DELETE_COMPLIANCE(id), API_CONFIG);
        fetchCompliance();
      } catch (error) {
        console.error('Error deleting compliance date:', error);
      }
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

  const toggleVisibility = async (id, currentStatus) => {
    try {
      await axios.put(API_ENDPOINTS.ADMIN_BLOG_VISIBILITY(id), { isActive: !currentStatus }, API_CONFIG);
      await fetchAllData();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this blog post?')) {
      try {
        await axios.delete(API_ENDPOINTS.ADMIN_DELETE_BLOG(id), API_CONFIG);
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
      previousData: { ...blog } // Store original data
    });
    setShowEditBlogModal(true);
  };

  const handleEditBlog = async () => {
    try {
      const formData = new FormData();
      formData.append('title', editBlogData.title);
      formData.append('content', editBlogData.content);
      formData.append('author', editBlogData.author);
      formData.append('previousData', JSON.stringify(editBlogData.previousData));

      if (editBlogData.image) {
        formData.append('image', editBlogData.image);
      }
      if (editBlogData.document) {
        formData.append('document', editBlogData.document);
      }

      const response = await axios.put(API_ENDPOINTS.ADMIN_UPDATE_BLOG(editBlogData.id), formData, MULTIPART_CONFIG);

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
    <AdminShell subtitle="Admin" navItems={NAV_ITEMS}>
      <div className="admin-head">
        <div>
          <h1>Admin dashboard</h1>
          <p>Blogs, job applications and contact enquiries.</p>
        </div>
      </div>

      <section className="admin-section" id="blogs">
        <div className="admin-section-head">
          <h2>Blog management</h2>
          <button type="button" onClick={() => setShowBlogModal(true)} className="btn btn-primary btn-sm">
            Add new blog
          </button>
        </div>
        <div className="admin-tbl-wrap">
          <table className="admin">
            <thead>
              <tr><th>Title</th><th>Author</th><th>Created</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className={!blog.is_active ? 'inactive-row' : ''}>
                  <td>{blog.title}</td>
                  <td>{blog.author}</td>
                  <td>{new Date(blog.created_at).toLocaleDateString()}</td>
                  <td><span className={`pill ${blog.is_active ? 'active' : 'inactive'}`}>{blog.is_active ? 'Active' : 'Hidden'}</span></td>
                  <td className="row-actions">
                    <button type="button" onClick={() => handleEditClick(blog)}>Edit</button>
                    <button type="button" onClick={() => toggleVisibility(blog.id, blog.is_active)}>
                      {blog.is_active ? 'Hide' : 'Show'}
                    </button>
                    <button type="button" onClick={() => handleDeleteBlog(blog.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {blogs.length === 0 && (
                <tr><td colSpan={5} style={{ color: 'var(--ink-faint)' }}>No blog posts yet.</td></tr>
              )}
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

        {showEditBlogModal && (
          <div className="admin-modal-overlay" onClick={() => setShowEditBlogModal(false)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Edit blog post</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleEditBlog(); }}>
                <input type="text" placeholder="Title" value={editBlogData.title} onChange={(e) => setEditBlogData({ ...editBlogData, title: e.target.value })} required />
                <textarea placeholder="Content" rows={5} value={editBlogData.content} onChange={(e) => setEditBlogData({ ...editBlogData, content: e.target.value })} required />
                <input type="text" placeholder="Author" value={editBlogData.author} onChange={(e) => setEditBlogData({ ...editBlogData, author: e.target.value })} required />
                <input type="file" accept="image/*" onChange={(e) => setEditBlogData({ ...editBlogData, image: e.target.files[0] })} />
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setEditBlogData({ ...editBlogData, document: e.target.files[0] })} />
                <div className="admin-modal-actions">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowEditBlogModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Update blog</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      <section className="admin-section" id="compliance">
        <div className="admin-section-head">
          <h2>Compliance calendar</h2>
          <button type="button" onClick={() => setShowComplianceModal(true)} className="btn btn-primary btn-sm">
            Add due date
          </button>
        </div>
        <div className="admin-tbl-wrap">
          <table className="admin">
            <thead>
              <tr><th>Category</th><th>Title</th><th>Due date</th><th>Cadence</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {complianceDates.map((entry) => (
                <tr key={entry.id} className={!entry.is_active ? 'inactive-row' : ''}>
                  <td>{entry.category}</td>
                  <td>{entry.title}</td>
                  <td>{new Date(entry.due_date).toLocaleDateString()}</td>
                  <td>{entry.cadence || '-'}</td>
                  <td><span className={`pill ${entry.is_active ? 'active' : 'inactive'}`}>{entry.is_active ? 'Active' : 'Hidden'}</span></td>
                  <td className="row-actions">
                    <button type="button" onClick={() => handleEditComplianceClick(entry)}>Edit</button>
                    <button type="button" onClick={() => toggleComplianceVisibility(entry.id, entry.is_active)}>
                      {entry.is_active ? 'Hide' : 'Show'}
                    </button>
                    <button type="button" onClick={() => handleDeleteCompliance(entry.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {complianceDates.length === 0 && (
                <tr><td colSpan={6} style={{ color: 'var(--ink-faint)' }}>No compliance dates yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {showComplianceModal && (
          <div className="admin-modal-overlay" onClick={() => setShowComplianceModal(false)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Add due date</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleAddCompliance(); }}>
                <input type="text" placeholder="Category (e.g. GST, Income Tax, ROC / Corporate)" value={complianceData.category} onChange={(e) => setComplianceData({ ...complianceData, category: e.target.value })} required />
                <input type="text" placeholder="Title (e.g. GSTR-3B - monthly summary return)" value={complianceData.title} onChange={(e) => setComplianceData({ ...complianceData, title: e.target.value })} required />
                <input type="date" value={complianceData.due_date} onChange={(e) => setComplianceData({ ...complianceData, due_date: e.target.value })} required />
                <input type="text" placeholder="Cadence (e.g. Monthly, Quarterly, Annual) - optional" value={complianceData.cadence} onChange={(e) => setComplianceData({ ...complianceData, cadence: e.target.value })} />
                <div className="admin-modal-actions">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowComplianceModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Add</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditComplianceModal && (
          <div className="admin-modal-overlay" onClick={() => setShowEditComplianceModal(false)}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Edit due date</h2>
              <form onSubmit={(e) => { e.preventDefault(); handleEditCompliance(); }}>
                <input type="text" placeholder="Category" value={editComplianceData.category} onChange={(e) => setEditComplianceData({ ...editComplianceData, category: e.target.value })} required />
                <input type="text" placeholder="Title" value={editComplianceData.title} onChange={(e) => setEditComplianceData({ ...editComplianceData, title: e.target.value })} required />
                <input type="date" value={editComplianceData.due_date} onChange={(e) => setEditComplianceData({ ...editComplianceData, due_date: e.target.value })} required />
                <input type="text" placeholder="Cadence - optional" value={editComplianceData.cadence} onChange={(e) => setEditComplianceData({ ...editComplianceData, cadence: e.target.value })} />
                <div className="admin-modal-actions">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowEditComplianceModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm">Update</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      <section className="admin-section" id="applications">
        <div className="admin-section-head">
          <h2>Job applications</h2>
          <button type="button" onClick={exportJobApplications} className="btn btn-ghost btn-sm">Export to Excel</button>
        </div>
        <div className="admin-tbl-wrap">
          <table className="admin">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Phone</th><th>Post applied for</th><th>Resume</th><th></th></tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.name}</td>
                  <td>{app.email}</td>
                  <td>{app.phone}</td>
                  <td>{app.post_applied_for}</td>
                  <td>
                    <a href={API_ENDPOINTS.ADMIN_DOWNLOAD_RESUME(app.resume_file_name)} target="_blank" rel="noopener noreferrer">
                      Download
                    </a>
                  </td>
                  <td className="row-actions">
                    <button type="button" onClick={() => handleDeleteClick(app.id, 'application')}>Archive</button>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr><td colSpan={6} style={{ color: 'var(--ink-faint)' }}>No active applications.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section" id="contacts">
        <div className="admin-section-head">
          <h2>Contact submissions</h2>
          <button type="button" onClick={exportContactSubmissions} className="btn btn-ghost btn-sm">Export to Excel</button>
        </div>
        <div className="admin-tbl-wrap">
          <table className="admin">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th><th></th></tr>
            </thead>
            <tbody>
              {contactSubmissions.map((submission) => (
                <tr key={submission.id}>
                  <td>{submission.name}</td>
                  <td>{submission.email}</td>
                  <td>{submission.subject}</td>
                  <td>{submission.message}</td>
                  <td>{new Date(submission.submission_date).toLocaleDateString()}</td>
                  <td className="row-actions">
                    <button type="button" onClick={() => handleDeleteClick(submission.id, 'contact')}>Archive</button>
                  </td>
                </tr>
              ))}
              {contactSubmissions.length === 0 && (
                <tr><td colSpan={6} style={{ color: 'var(--ink-faint)' }}>No active submissions.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          message={`Are you sure you want to archive this ${modalType}?`}
        />
      </section>
    </AdminShell>
  );
};

export default AdminDashboard;
