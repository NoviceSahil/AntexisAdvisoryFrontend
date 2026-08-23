// Replaces the xlsx (SheetJS) package, which has known prototype-pollution
// and ReDoS CVEs with no fix available from the maintainer - not worth
// keeping around just to export a list of records, especially since the
// data being exported (job applications, contact submissions) originates
// from public, unauthenticated form fields. A CSV opens directly in
// Excel/Sheets, so nothing is lost by dropping the dependency.

const escapeCsvValue = (value) => {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export function exportToCsv(data, filename) {
  if (!data || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const rows = data.map((row) => headers.map((key) => escapeCsvValue(row[key])).join(','));
  const csv = [headers.join(','), ...rows].join('\r\n');

  // Leading BOM so Excel opens UTF-8 content (e.g. non-ASCII names) correctly.
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
