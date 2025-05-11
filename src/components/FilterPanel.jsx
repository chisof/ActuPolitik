import React from 'react';
export default function FilterPanel({ feeds, filters, setFilters }) {
  const toggleSource = id => {
    const list = filters.sources.includes(id)
      ? filters.sources.filter(s => s !== id)
      : [...filters.sources, id];
    setFilters({ ...filters, sources: list });
  };
  return (
    <div className="bg-gray-800 p-4 rounded mb-4 grid grid-cols-3 gap-4">
      <div>
        <h4 className="font-bold mb-2">Sources</h4>
        <ul className="space-y-1">
          {feeds.map(f => (
            <li key={f.id}>
              <label>
                <input
                  type="checkbox"
                  checked={filters.sources.includes(f.id)}
                  onChange={() => toggleSource(f.id)}
                  className="mr-2"
                />
                {f.name}
              </label>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h4 className="font-bold mb-2">De</h4>
        <input
          type="date"
          value={filters.from}
          onChange={e => setFilters({ ...filters, from: e.target.value })}
          className="w-full p-2 bg-gray-700 rounded"
        />
      </div>
      <div>
        <h4 className="font-bold mb-2">À</h4>
        <input
          type="date"
          value={filters.to}
          onChange={e => setFilters({ ...filters, to: e.target.value })}
          className="w-full p-2 bg-gray-700 rounded"
        />
      </div>
    </div>
}
