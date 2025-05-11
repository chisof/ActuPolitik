import React from 'react';
import ArticleCard from './ArticleCard';
export default function ArticleGrid({ articles }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {articles.map((art, idx) => <ArticleCard key={idx} article={art} />)}
    </div>
  );
}
