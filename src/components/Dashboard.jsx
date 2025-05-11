import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import FilterPanel from './FilterPanel';
import ExportButtons from './ExportButtons';

export default function Dashboard({ articles, feeds, setArticles }) {
  const [filters, setFilters] = useState({ sources: [], from: '', to: '' });

  const applyFilters = () => {
    return articles.filter(a => {
      const bySource = filters.sources.length ? filters.sources.includes(a.source) : true;
      const date = new Date(a.publishedAt);
      const afterFrom = filters.from ? date >= new Date(filters.from) : true;
      const beforeTo = filters.to ? date <= new Date(filters.to) : true;
      return bySource && afterFrom && beforeTo;
    });
  };

  const filtered = applyFilters();
  const counts = filtered.reduce((acc, { relevanceCategory }) => {
    acc[relevanceCategory] = (acc[relevanceCategory] || 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(counts).map(([category, count]) => ({ category, count }));

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Dashboard de Pertinence</h2>
      <FilterPanel
        feeds={feeds}
        filters={filters}
        setFilters={setFilters}
      />
      <ExportButtons data={filtered} />
      <div className="mt-6">
        <BarChart width={600} height={300} data={data} className="mx-auto">
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" />
        </BarChart>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Top 5 Articles Pertinents</h3>
        <ul className="list-disc ml-6">
          {filtered
            .filter(a => a.relevanceCategory === 'Très élevée')
            .slice(0, 5)
            .map((a, i) => (
              <li key={i} className="mb-2">
                <a href={a.url} target="_blank" rel="noopener noreferrer" className="underline">
                  {a.title}
                </a>
              </li>
            ))}
        </ul>
      </div>
    </div>
}
