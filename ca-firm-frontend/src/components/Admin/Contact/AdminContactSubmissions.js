import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('/api/contact-submissions');
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching contact submissions:', error);
      }
    };

    fetchSubmissions();
  }, []);

  return (
    <div className="admin-contact-submissions">
      <h2>Contact Form Submissions</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subject</th>
            <th>Message</th>
            <th>Submission Date</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td>{submission.name}</td>
              <td>{submission.email}</td>
              <td>{submission.subject}</td>
              <td>{submission.message}</td>
              <td>{new Date(submission.submission_date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminContactSubmissions;
