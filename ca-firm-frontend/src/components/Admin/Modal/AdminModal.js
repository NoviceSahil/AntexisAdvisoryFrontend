import React, { useState, useEffect } from 'react';

const AdminModal = ({ show, onClose, user, onSubmit }) => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'admin' });

  // Re-seed the form whenever a different user is opened for editing (or
  // the modal is opened fresh to add one) - otherwise stale state from a
  // previous edit could leak into the next.
  useEffect(() => {
    setFormData(user ? { username: user.username, password: '', role: user.role } : { username: '', password: '', role: 'admin' });
  }, [user, show]);

  if (!show) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{user ? 'Edit admin' : 'Add new admin'}</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit(formData);
          }}
        >
          <input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder={user ? 'New password (leave blank to keep current)' : 'Password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required={!user}
            minLength={8}
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
          <div className="admin-modal-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">{user ? 'Update' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminModal;
