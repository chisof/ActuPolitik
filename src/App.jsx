// Project: ActuPolitik War Room Dashboard
// Tech Stack: React, Tailwind CSS, Firebase (Realtime Database & Analytics), OpenAI API, jsPDF, Framer Motion

// File: src/App.jsx
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import ArticleGrid from './components/ArticleGrid';
import Dashboard from './components/Dashboard';
import { fetchFeeds, aiSearch, aiClassify } from './services/api';
import { initNotifications, subscribeToTopics } from './services/notifications';
import { motion, AnimatePresence } from 'framer-motion';
import { getDatabase, ref, onValue } from 'firebase/database';
import { initFirebaseApp } from './services/firebase';

export default function App() {
  const [feeds, setFeeds] = useState([]);
  const [articles, setArticles] = useState([]);
  const [mode, setMode] = useState('feed');

  useEffect(() => {
    initFirebaseApp();
    const db = getDatabase();
    // Realtime listener for new articles count
    const statsRef = ref(db, 'stats/articleCount');
    onValue(statsRef, snapshot => {
      const count = snapshot.val();
      console.log('Realtime article count:', count);
    });

    async function load() {
      const allFeeds = await fetchFeeds();
      const flat = allFeeds.flatMap(f => f.articles.map(a => ({ ...a, source: f.id })));
      const classified = await aiClassify(flat);
      setFeeds(allFeeds.map(f => ({ ...f, articles: classified.filter(a => a.source === f.id) })));
      setArticles(classified);
      await initNotifications();
      subscribeToTopics(['politique', 'elections', 'geopolitique']);
    }
    load();
  }, []);

  const handleSearch = async q => {
    if (!q.trim()) return setArticles(feeds.flatMap(f => f.articles));
    const result = await aiSearch(q);
    const classified = await aiClassify(result.map(a => ({ ...a, source: a.source || 'search' })));
    setArticles(classified);
  };

  return (
    <motion.div className="min-h-screen bg-gray-900 text-green-200 font-mono"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="grid grid-cols-12">
        <aside className="col-span-2 bg-gray-800 p-4">
          <motion.h2 className="text-2xl font-bold mb-6"
            initial={{ x: -50 }} animate={{ x: 0 }} transition={{ type: 'spring', stiffness: 100 }}
          >War Room</motion.h2>
          <button className={`w-full mb-3 text-left ${mode==='feed'? 'text-white':'hover:text-white'}`}
            onClick={() => setMode('feed')}
          >Flux d'actus</button>
          <button className={`w-full mb-6 text-left ${mode==='dashboard'? 'text-white':'hover:text-white'}`}
            onClick={() => setMode('dashboard')}
          >Dashboard</button>
          <Sidebar feeds={feeds} onSelect={arts => setArticles(arts)} />
        </aside>
        <main className="col-span-10 p-6">
          <AnimatePresence exitBeforeEnter>
            {mode === 'feed' ? (
              <motion.div key="feed" initial={{ x: 50 }} animate={{ x: 0 }} exit={{ x: -50 }}>
                <SearchBar onSearch={handleSearch} />
                <ArticleGrid articles={articles} />
              </motion.div>
            ) : (
              <motion.div key="dashboard" initial={{ x: 50 }} animate={{ x: 0 }} exit={{ x: -50 }}>
                <Dashboard articles={articles} feeds={feeds} setArticles={setArticles} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}
