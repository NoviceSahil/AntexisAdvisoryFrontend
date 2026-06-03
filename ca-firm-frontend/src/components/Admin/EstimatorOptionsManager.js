import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

const EstimatorOptionsManager = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newOption, setNewOption] = useState({
    category: 'service_area',
    label: '',
    value: '',
    position: 0,
    is_active: true
  });

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.ADMIN_ESTIMATOR_OPTIONS);
      setOptions(response.data);
      setError(null);
    } catch (fetchError) {
      console.error('Error fetching estimator options:', fetchError);
      setError('Unable to load estimator options.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (id, field, value) => {
    setOptions((current) => current.map((option) => (
      option.id === id ? { ...option, [field]: value } : option
    )));
  };

  const saveOption = async (option) => {
    try {
      await axios.put(API_ENDPOINTS.ADMIN_UPDATE_ESTIMATOR_OPTION(option.id), option);
      fetchOptions();
    } catch (saveError) {
      console.error('Error saving estimator option:', saveError.response || saveError);
      setError(saveError.response?.data?.error || 'Unable to save estimator option.');
    }
  };

  const addOption = async () => {
    try {
      await axios.post(API_ENDPOINTS.ADMIN_CREATE_ESTIMATOR_OPTION, newOption);
      setNewOption({ category: 'service_area', label: '', value: '', position: 0, is_active: true });
      fetchOptions();
    } catch (createError) {
      console.error('Error creating estimator option:', createError.response || createError);
      setError(createError.response?.data?.error || 'Unable to create estimator option.');
    }
  };

  const deleteOption = async (id) => {
    if (!window.confirm('Delete this estimator option?')) {
      return;
    }
    try {
      await axios.delete(API_ENDPOINTS.ADMIN_DELETE_ESTIMATOR_OPTION(id));
      fetchOptions();
    } catch (deleteError) {
      console.error('Error deleting estimator option:', deleteError);
      setError('Unable to delete estimator option.');
    }
  };

  const categoryLabels = {
    service_area: 'Service area',
    company_size: 'Company size',
    timeline: 'Timeline',
    budget: 'Budget'
  };

  return (
    <div className="dashboard-section">
      <div className="section-header">
        <h2>Estimator dropdown settings</h2>
      </div>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <p>Loading estimator options…</p>
      ) : (
        <div className="estimator-options-manager">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Label</th>
                <th>Value</th>
                <th>Position</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {options.map((option) => (
                <tr key={option.id}>
                  <td>{categoryLabels[option.category] || option.category}</td>
                  <td>
                    <input
                      type="text"
                      value={option.label}
                      onChange={(e) => handleOptionChange(option.id, 'label', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={option.value}
                      onChange={(e) => handleOptionChange(option.id, 'value', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={option.position}
                      onChange={(e) => handleOptionChange(option.id, 'position', Number(e.target.value))}
                      min="0"
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={option.is_active}
                      onChange={(e) => handleOptionChange(option.id, 'is_active', e.target.checked)}
                    />
                  </td>
                  <td>
                    <button type="button" className="button button-secondary" onClick={() => saveOption(option)}>
                      Save
                    </button>
                    <button type="button" className="button button-danger" onClick={() => deleteOption(option.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="estimator-option-form">
            <h3>Add new option</h3>
            <div className="form-grid">
              <label>
                Category
                <select
                  value={newOption.category}
                  onChange={(e) => setNewOption({ ...newOption, category: e.target.value })}
                >
                  <option value="service_area">Service area</option>
                  <option value="company_size">Company size</option>
                  <option value="timeline">Timeline</option>
                  <option value="budget">Budget</option>
                </select>
              </label>
              <label>
                Label
                <input
                  type="text"
                  value={newOption.label}
                  onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                />
              </label>
              <label>
                Value
                <input
                  type="text"
                  value={newOption.value}
                  onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                />
              </label>
              <label>
                Position
                <input
                  type="number"
                  value={newOption.position}
                  onChange={(e) => setNewOption({ ...newOption, position: Number(e.target.value) })}
                  min="0"
                />
              </label>
            </div>
            <button type="button" className="button button-primary" onClick={addOption}>
              Add option
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstimatorOptionsManager;
