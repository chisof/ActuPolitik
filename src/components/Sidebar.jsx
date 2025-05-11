import React from 'react';
export default function Sidebar({ feeds, onSelect }) {
  return (
    <ul className="space-y-2">
      {feeds.map(feed => (
        <li key={feed.id}>
          <button
            className="w-full text-left hover:text-white"
            onClick={() => onSelect(feed.articles)}
          >
            {feed.name}
          </button>
        </li>
      ))}
    </ul>
  );
}
