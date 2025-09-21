import React, { useState } from 'react';
import * as api from '../services/apiService';
import Icon from './Icon.tsx';

interface MagicComposePanelProps {
  text: string;
  onComposeSelect: (composedText: string) => void;
}

const STYLES = ['Formal', 'Casual', 'Funny', 'Poetic', 'Confident'];

const MagicComposePanel: React.FC<MagicComposePanelProps> = ({ text, onComposeSelect }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const handleCompose = async (style: string) => {
    if (!text.trim()) return;
    setIsLoading(true);
    setError('');
    try {
        const { composedText } = await api.magicCompose(text, style);
        setResults(prev => ({ ...prev, [style]: composedText.trim() }));
    } catch (err) {
        setError('Could not generate text. Please try again.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-yellow-300">
                <Icon className="w-5 h-5" fill="currentColor"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></Icon>
                Magic Compose
            </div>
            {isLoading && (
                 <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            )}
        </div>
      <div className="space-y-2">
        {STYLES.map(style => (
          <div key={style}>
            {results[style] ? (
              <div onClick={() => onComposeSelect(results[style])} className="p-2 bg-gray-700/50 rounded-md text-sm cursor-pointer hover:bg-gray-600">
                {results[style]}
              </div>
            ) : (
              <button onClick={() => handleCompose(style)} disabled={isLoading} className="w-full text-left p-2 bg-gray-700/50 rounded-md text-sm hover:bg-gray-600 disabled:opacity-50">
                Generate <span className="font-semibold">{style}</span> version
              </button>
            )}
          </div>
        ))}
      </div>
       {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default MagicComposePanel;
