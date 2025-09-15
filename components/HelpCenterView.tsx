import React, { useState } from 'react';
import type { HelpArticle } from '../types.ts';
import Icon from './Icon.tsx';

interface HelpCenterViewProps {
  articles: HelpArticle[];
  onBack: () => void;
}

const HelpCenterView: React.FC<HelpCenterViewProps> = ({ articles, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const filteredArticles = articles.filter(
    article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const categories = [...new Set(articles.map(a => a.category))];

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 hover:bg-gray-800 rounded-full">
            <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></Icon>
        </button>
        <h1 className="text-2xl font-bold">Help Center</h1>
      </div>

      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search for help..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></Icon>
        </div>
      </div>

      <div className="space-y-6">
        {searchTerm ? (
            filteredArticles.map(article => (
                <div key={article.id} className="bg-gray-900 p-4 rounded-lg">
                    <h3 className="font-semibold">{article.title}</h3>
                    <p className="text-sm text-gray-400 mt-1">{article.content}</p>
                </div>
            ))
        ) : (
            categories.map(category => (
                <div key={category}>
                    <h2 className="text-xl font-semibold mb-3">{category}</h2>
                    <div className="space-y-2">
                        {articles.filter(a => a.category === category).map(article => (
                            <div key={article.id}>
                                <button onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)} className="w-full text-left p-4 bg-gray-800/50 hover:bg-gray-800 rounded-lg flex justify-between items-center transition-colors">
                                    <span>{article.title}</span>
                                    <Icon className={`w-5 h-5 transition-transform ${expandedArticle === article.id ? 'rotate-180' : ''}`}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></Icon>
                                </button>
                                {expandedArticle === article.id && (
                                    <div className="p-4 text-gray-300 text-sm bg-gray-800/30 rounded-b-lg">
                                        {article.content}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))
        )}
         {searchTerm && filteredArticles.length === 0 && <p className="text-center text-gray-500">No articles found.</p>}
      </div>
    </div>
  );
};

export default HelpCenterView;
