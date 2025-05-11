import React, { useState } from 'react';
export default function SearchBar({ onSearch }) {
  const [input, setInput] = useState('');
  const submit = e => {
    e.preventDefault();
    onSearch(input);
  };
  return (
    <form onSubmit={submit} className="mb-6">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Recherche boostée par ChatGPT..."
        className="w-full p-2 bg-gray-700 rounded focus:outline-none"
      />
    </form>
  );
}
