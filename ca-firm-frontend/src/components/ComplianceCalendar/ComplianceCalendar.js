import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const dateKey = (year, month, day) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

const ComplianceCalendar = () => {
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState(() => { const d = new Date(); return { year: d.getFullYear(), month: d.getMonth() }; });
  const [selectedKey, setSelectedKey] = useState(null);
  useDocumentTitle('Compliance Calendar');

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.COMPLIANCE_DATES);
        setDates(response.data);
        // Land on the soonest upcoming deadline already selected (API
        // returns soonest-first) instead of an empty panel the visitor has
        // to click a day to fill in - the whole point of this page is
        // showing what's due, so that should be visible immediately. Jump
        // the grid to that month too, so the highlighted cell is actually
        // on screen rather than selected-but-invisible in another month.
        if (response.data.length > 0) {
          const soonestKey = response.data[0].due_date.slice(0, 10);
          const [y, m] = soonestKey.split('-').map(Number);
          setSelectedKey(soonestKey);
          setCursor({ year: y, month: m - 1 });
        }
      } catch (error) {
        console.error('Error fetching compliance dates:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDates();
  }, []);

  // Group by calendar day for O(1) lookup per grid cell. A due date is a
  // pure calendar date with no meaningful time-of-day or timezone - taking
  // the YYYY-MM-DD prefix directly (rather than round-tripping through a
  // Date object's local or UTC getters, both of which apply a timezone
  // lens that could shift the date by a day depending on the visitor's
  // timezone) keeps it exactly what the admin entered, for every visitor.
  const byDay = useMemo(() => {
    const map = new Map();
    dates.forEach((entry) => {
      const key = entry.due_date.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(entry);
    });
    return map;
  }, [dates]);

  const today = new Date();
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const grid = useMemo(() => {
    const { year, month } = cursor;
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstWeekday; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) cells.push(day);
    return cells;
  }, [cursor]);

  const changeMonth = (delta) => {
    setSelectedKey(null);
    setCursor(({ year, month }) => {
      const d = new Date(year, month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const selectedEvents = selectedKey ? (byDay.get(selectedKey) || []) : [];

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
        ) : (
          <>
            <div className="cal-nav">
              <button type="button" className="cal-nav-btn" onClick={() => changeMonth(-1)} aria-label="Previous month">←</button>
              <span className="cal-nav-label num">{MONTH_NAMES[cursor.month]} {cursor.year}</span>
              <button type="button" className="cal-nav-btn" onClick={() => changeMonth(1)} aria-label="Next month">→</button>
            </div>

            <div className="cal-grid">
              {WEEKDAYS.map((w) => <div className="cal-grid-head" key={w}>{w}</div>)}
              {grid.map((day, i) => {
                if (day === null) return <div className="cal-cell cal-cell-empty" key={`blank-${i}`} />;
                const key = dateKey(cursor.year, cursor.month, day);
                const events = byDay.get(key) || [];
                const hasEvents = events.length > 0;
                const isToday = key === todayKey;
                const isSelected = key === selectedKey;
                return (
                  <button
                    type="button"
                    key={key}
                    className={`cal-cell${hasEvents ? ' has-events' : ''}${isToday ? ' is-today' : ''}${isSelected ? ' is-selected' : ''}`}
                    onClick={() => hasEvents && setSelectedKey(isSelected ? null : key)}
                    disabled={!hasEvents}
                  >
                    <span className="cal-cell-day num">{day}</span>
                    {hasEvents && (
                      <span className="cal-cell-label">
                        {events[0].category}{events.length > 1 ? ` +${events.length - 1}` : ''}
                      </span>
                    )}
                    {hasEvents && (
                      <div className="cal-tooltip">
                        {events.map((e) => (
                          <div key={e.id} className="cal-tooltip-row">
                            <span className="cal-tooltip-cat">{e.category}{e.cadence ? ` · ${e.cadence}` : ''}</span>
                            <span className="cal-tooltip-title">{e.title}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedKey && (
              <div className="cal-selected">
                <span className="related-title">
                  {dates[0] && selectedKey === dates[0].due_date.slice(0, 10) ? 'Next due — ' : ''}
                  {new Date(selectedKey + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
                {selectedEvents.map((entry) => (
                  <div className="cal-row" key={entry.id}>
                    <span className="cal-date num">{formatDate(entry.due_date)}</span>
                    <span className="cal-name">{entry.title}</span>
                    <span className="cal-tag">{entry.category}{entry.cadence ? ` · ${entry.cadence}` : ''}</span>
                  </div>
                ))}
              </div>
            )}

            {dates.length === 0 && (
              <p className="bull-empty">No upcoming dates published yet.</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ComplianceCalendar;
