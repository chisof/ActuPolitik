import React from 'react';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

export default function ExportButtons({ data }) {
  const exportCSV = () => {
    const header = ['Title', 'Summary', 'URL', 'Relevance', 'Date'];
    const rows = data.map(a => [a.title, a.summary, a.url, a.relevanceCategory, a.publishedAt]);
    const csv = [header, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'dashboard.csv');
  };
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Dashboard ActuPolitik', 10, 10);
    data.slice(0, 10).forEach((a, i) => {
      doc.text(`${i+1}. ${a.title}`, 10, 20 + i * 10);
    });
    doc.save('dashboard.pdf');
  };
  return (
    <div className="flex space-x-4 mb-4">
      <button onClick={exportCSV} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
        Export CSV
      </button>
      <button onClick={exportPDF} className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600">
        Export PDF
      </button>
    </div>
}
