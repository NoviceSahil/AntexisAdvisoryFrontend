import React, { useState } from 'react';
import './ApplyOnline.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, MULTIPART_CONFIG } from '../../config/api';


const ApplyOnline = ({ setIsSubmitted }) => {
  const [formData, setFormData] = useState({
    postAppliedFor: '',
    name: '',
    phone: '',
    email: '',
    qualification: '',
    yearOfQualification: '',
    address: '',
    otherDetails: '',
    preferredWorkLocation: '',
    resume: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      resume: e.target.files[0],
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData(); 

    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post(API_ENDPOINTS.APPLY, formData, MULTIPART_CONFIG);
      
      setIsSubmitted(true);
      console.log(response.data);
      navigate('/application-success');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Error submitting application. Please try again.');
    }
  };
  

  return (
    <div className="career-container">
      <h4 className="career-title">For exciting career opportunities with us, please follow the "Application Process":</h4>
      <form onSubmit={handleSubmit} className="career-form">
        <div className="apply-form-section">
          <div className="one_third">
            <p>
              <span>Post Applied For:<br />
                <select name="postAppliedFor" value={formData.postAppliedFor} onChange={handleChange} required>
                  <option value="">—Please choose an option—</option>
                  <option value="Intern/Trainee">Intern/Trainee</option>
                  <option value="International Tax">International Tax</option>
                  <option value="Corporate Tax">Corporate Tax</option>
                </select>
              </span>
            </p>
          </div>
          <div className="one_third">
            <p>Name: <input type="text" name="name" value={formData.name} onChange={handleChange} required /></p>
          </div>
          <div className="one_third">
            <p>Phone: <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required /></p>
          </div>
        </div>

        <div className="apply-form-section">
          <div className="one_third">
            <p>Email: <input type="email" name="email" value={formData.email} onChange={handleChange} required /></p>
          </div>
          <div className="one_third">
            <p>
              Qualification:<br />
              <select name="qualification" value={formData.qualification} onChange={handleChange} required>
                <option value="">—Please choose an option—</option>
                <option value="Other">Other</option>
                <option value="CA-Final">CA-Final</option>
                <option value="CA-Final-Group-I">CA-Final-Group-I</option>
                
              </select>
            </p>
          </div>
          <div className="one_third">
            <p>Year of Qualification:<br />
              <input type="date" name="yearOfQualification" value={formData.yearOfQualification} onChange={handleChange} required />
            </p>
          </div>
        </div>

        <div className="apply-form-section">
          <div className="one_half">
            <p>Address: <textarea name="address" value={formData.address} onChange={handleChange}></textarea></p>
          </div>
          <div className="one_half">
            <p>Any other details you wish to add: <textarea name="otherDetails" value={formData.otherDetails} onChange={handleChange}></textarea></p>
          </div>
        </div>

        <div className="apply-form-section">
          <div className="one_third">
            <p>
              Choose preferred work location:
              <select name="preferredWorkLocation" value={formData.preferredWorkLocation} onChange={handleChange} required>
                <option value="Noida">Noida</option>
                <option value="New Delhi">New Delhi</option>
                <option value="Gurugram">Gurugram</option>
                
              </select>
            </p>
          </div>
          <div className="custom-paragraph mt-4">
            <p>Upload your Resume: <input type="file" name="resume" onChange={handleFileChange} accept=".jpg,.png,.jpeg,.pdf" required /></p>
          </div>
        </div>

        {/* <p className="custom-paragraph">
  Upload candidate profile form: 
  <a 
    href={`${process.env.PUBLIC_URL}/documents/candidate-profile-form.docx`} 
    target="_blank"
    rel="noopener noreferrer"
  >
    DOWNLOAD CANDIDATE PROFILE FORM
  </a>
</p> */}
<p className="custom-paragraph">For any other inquiries please mail at: <a href="mailto:office@antexisadvisory.com">office@antexisadvisory.com</a></p>

        <p className="custom-paragraph"><input type="submit" value="Send" /></p>
      </form>
    </div>
  );
  
};

export default ApplyOnline;
