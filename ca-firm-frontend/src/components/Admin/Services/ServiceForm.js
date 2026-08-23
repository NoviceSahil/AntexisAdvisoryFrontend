import React, { useState } from 'react';

const emptyService = { slug: '', title: '', summary: '', scope: '', deliverables: [['', '']], who_for: '', related: [] };

// Shared add/edit form for both AdminDashboard and SuperAdminDashboard - the
// only difference between the two callers is what onSubmit does (create vs.
// update endpoint) and which service list they pass in for the related-
// services checklist.
const ServiceForm = ({ initialData, allServices, isEdit, onSubmit, onCancel }) => {
  const [data, setData] = useState(initialData || emptyService);

  const updateDeliverable = (i, field, value) => {
    const next = data.deliverables.map((row, idx) => {
      if (idx !== i) return row;
      return field === 'label' ? [value, row[1]] : [row[0], value];
    });
    setData({ ...data, deliverables: next });
  };

  const addDeliverableRow = () => setData({ ...data, deliverables: [...data.deliverables, ['', '']] });
  const removeDeliverableRow = (i) => setData({ ...data, deliverables: data.deliverables.filter((_, idx) => idx !== i) });

  const toggleRelated = (slug) => {
    setData({
      ...data,
      related: data.related.includes(slug) ? data.related.filter((s) => s !== slug) : [...data.related, slug]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...data,
      // Drop any deliverable row left completely blank, rather than
      // submitting empty pairs.
      deliverables: data.deliverables.filter(([label, desc]) => label.trim() || desc.trim())
    });
  };

  const candidates = allServices.filter((s) => s.slug !== data.slug);

  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? 'Edit service' : 'Add new service'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Slug (e.g. audit-and-assurance)"
            value={data.slug}
            onChange={(e) => setData({ ...data, slug: e.target.value })}
            required
            disabled={isEdit}
            title={isEdit ? "Slug can't be changed after creation - it's used in the public URL and by other services' related lists" : undefined}
          />
          <input
            type="text"
            placeholder="Title"
            value={data.title}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Summary (short, shown on the service cards)"
            value={data.summary}
            onChange={(e) => setData({ ...data, summary: e.target.value })}
            required
          />
          <textarea
            placeholder="Scope of work"
            rows={3}
            value={data.scope}
            onChange={(e) => setData({ ...data, scope: e.target.value })}
            required
          />

          <span className="field-label">Deliverables</span>
          {data.deliverables.map(([label, desc], i) => (
            <div className="deliverable-row" key={i}>
              <div className="field-row">
                <input
                  type="text"
                  placeholder="Label"
                  value={label}
                  onChange={(e) => updateDeliverable(i, 'label', e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Short description"
                  value={desc}
                  onChange={(e) => updateDeliverable(i, 'desc', e.target.value)}
                />
              </div>
              <button type="button" className="btn btn-ghost btn-sm btn-block" onClick={() => removeDeliverableRow(i)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-sm" onClick={addDeliverableRow}>
            + Add deliverable
          </button>

          <textarea
            placeholder="Who it's for"
            rows={3}
            value={data.who_for}
            onChange={(e) => setData({ ...data, who_for: e.target.value })}
            required
            style={{ marginTop: 14 }}
          />

          <span className="field-label">Related services</span>
          <div className="related-checklist">
            {candidates.length === 0 ? (
              <span className="empty">No other services yet.</span>
            ) : (
              candidates.map((s) => (
                <label key={s.slug}>
                  <input
                    type="checkbox"
                    checked={data.related.includes(s.slug)}
                    onChange={() => toggleRelated(s.slug)}
                  />
                  {s.title}
                </label>
              ))
            )}
          </div>

          <div className="admin-modal-actions">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">{isEdit ? 'Update' : 'Add'} service</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
