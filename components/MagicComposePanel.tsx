import React, { useState, useEffect } from 'react';
import * as api from '../services/apiService';
import Icon from './Icon.tsx';

interface MagicComposePanelProps {
  originalText: string;
  onSelectSuggestion: (text: string) => void;
  onClose: () => void;
}

const MagicComposePanel: React.FC<MagicComposePanelProps> = ({ originalText, onSelectSuggestion, onClose }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generate = async () => {
      if (!originalText) {
          setError("Please write something first.");
          setIsLoading(false);
          return;
      };
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.generateMagicText(originalText);
        setSuggestions(response.suggestions);
      } catch (err) {
        setError("Sorry, we couldn't generate suggestions. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    generate();
  }, [originalText]);

  return (
    <div className="absolute bottom-full mb-2 w-full max-w-lg bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20">
      <div className="flex items-center justify-between p-2 border-b border-gray-700">
        <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-purple-400"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></Icon>
            <h3 className="text-sm font-semibold">Magic Compose</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-full"><Icon className="w-4 h-4"><path d="M6 18L18 6M6 6l12 12" /></Icon></button>
      </div>

      <div className="p-3">
        {isLoading && (
            <div className="flex items-center justify-center h-24">
                <p className="text-sm text-gray-400">Generating ideas...</p>
            </div>
        )}
        {error && <p className="text-sm text-red-400 p-2">{error}</p>}
        {!isLoading && !error && (
            <div className="space-y-2">
                {suggestions.map((s, i) => (
                    <button key={i} onClick={() => onSelectSuggestion(s)} className="w-full text-left text-sm p-2 bg-gray-700/50 hover:bg-gray-700 rounded-md">
                        {s}
                    </button>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default MagicComposePanel;