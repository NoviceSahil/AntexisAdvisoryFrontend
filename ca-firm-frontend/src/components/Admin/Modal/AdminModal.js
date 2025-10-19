import {React, useState} from "react";

const AdminModal = ({ show, onClose, user, onSubmit }) => {
    const [formData, setFormData] = useState(
      user || { username: '', password: '', role: 'admin' }
    );
  
    if (!show) return null;
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{user ? 'Edit Admin' : 'Add New Admin'}</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
            <div className="modal-buttons">
              <button type="submit">{user ? 'Update' : 'Add'}</button>
              <button type="button" onClick={onClose}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  export default AdminModal;