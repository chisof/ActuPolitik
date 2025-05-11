import React, { useState } from 'react';
export default function ArticleCard({ article }) {
  const [tags, setTags] = useState(article.tags || []);
  const [input, setInput] = useState('');
  const speak = () => {
    if (!window.speechSynthesis) return;
    const msg = new SpeechSynthesisUtterance(article.summary || article.title);
    window.speechSynthesis.speak(msg);
  };
  const addTag = e => {
    e.preventDefault();
    if (input.trim()) setTags([...tags, input.trim()]);
    setInput('');
  };
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-xl transition relative">
      <h3 className="font-bold mb-2">{article.title}</h3>
      <p className="text-sm mb-2 line-clamp-4">{article.summary}</p>
      <div className="flex space-x-2 mb-2">
        {tags.map((t,i) => (
          <span key={i} className="bg-green-700 px-2 py-1 rounded text-xs">{t}</span>
        ))}
      </div>
      <form onSubmit={addTag} className="flex mb-4">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ajouter un tag"
          className="flex-1 p-2 bg-gray-700 rounded-l focus:outline-none"
        />
        <button type="submit" className="bg-green-600 px-4 rounded-r hover:bg-green-500">
          +
        </button>
      </form>
      <div className="flex justify-between items-center">
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="underline">
          Lire
        </a>
        <button onClick={speak} className="ml-2 p-1 hover:text-white">🔊</button>
      </div>
    </div>
}
