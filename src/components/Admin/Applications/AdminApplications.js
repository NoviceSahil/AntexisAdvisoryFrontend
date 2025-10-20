import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminApplications.css';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('/api/applications'); // Adjust API endpoint as needed
        setApplications(response.data);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="admin-applications">
      <h2>Submitted Applications</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Post Applied For</th>
            <th>Resume</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id}>
              <td>{app.name}</td>
              <td>{app.email}</td>
              <td>{app.phone}</td>
              <td>{app.post_applied_for}</td>
              {/* Assuming resume_file_name is the field storing the filename */}
              <td><a href={`/uploads/${app.resume_file_name}`} download>Download Resume</a></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminApplications;
