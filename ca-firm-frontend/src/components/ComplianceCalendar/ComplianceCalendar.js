import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

const ComplianceCalendar = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  useDocumentTitle('Compliance Calendar');

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.COMPLIANCE_DATES);
        setDates(response.data);
      } catch (error) {
        console.error('Error fetching compliance dates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDates();
  }, []);

  // Group by category client-side, preserving the soonest-first order the
  // API already returns them in.
  const groups = dates.reduce((acc, entry) => {
    const bucket = acc.find((g) => g.category === entry.category);
    if (bucket) bucket.items.push(entry);
    else acc.push({ category: entry.category, items: [entry] });
    return acc;
  }, []);

  return (
    <>
      <section className="page-hero panel">
        <span className="eyebrow">Compliance calendar</span>
        <h1>Upcoming due dates.</h1>
        <p>GST, income tax and ROC filing deadlines - maintained by our team, not a fixed schedule, so check back as dates approach.</p>
      </section>

      <div className="panel" style={{ paddingBottom: '76px' }}>
        {loading ? (
          <p className="bull-empty">Loading…</p>
        ) : groups.length === 0 ? (
          <p className="bull-empty">No upcoming dates published yet.</p>
        ) : (
          groups.map((group) => (
            <div className="cal-group" key={group.category}>
              <h3>{group.category}</h3>
              {group.items.map((entry) => (
                <div className="cal-row" key={entry.id}>
                  <span className="cal-date num">{formatDate(entry.due_date)}</span>
                  <span className="cal-name">{entry.title}</span>
                  {entry.cadence && <span className="cal-tag">{entry.cadence}</span>}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ComplianceCalendar;
