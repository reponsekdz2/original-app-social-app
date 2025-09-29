import React, { useState } from 'react';
import { generatePostCaption } from '../services/geminiService.ts';
import Icon from './Icon.tsx';

interface MagicComposePanelProps {
  onSuggestionSelect: (suggestion: string) => void;
  imageDescription: string;
}

const MagicComposePanel: React.FC<MagicComposePanelProps> = ({ onSuggestionSelect, imageDescription }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const caption = await generatePostCaption(imageDescription || 'a beautiful photo');
      // Simple split for now. A more robust solution might parse the response differently.
      setSuggestions(caption.split('\n').filter(s => s.trim() !== ''));
    } catch (err) {
      console.error(err);
      setError('Sorry, could not generate suggestions at this time.');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-full max-w-sm h-96 flex flex-col absolute bottom-full mb-2 right-0">
      <div className="p-3 border-b border-gray-700 text-center">
        <h3 className="font-semibold text-sm">Magic Compose ✨</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Generating...</p>
          </div>
        ) : error ? (
            <div className="text-center text-red-400 pt-8">
                <p>{error}</p>
            </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((s, i) => (
            <button key={i} onClick={() => onSuggestionSelect(s)} className="w-full text-left p-2 bg-gray-700/50 hover:bg-gray-700 rounded-md text-sm">
              {s}
            </button>
          ))
        ) : (
          <div className="text-center text-gray-400 pt-8">
            <p>Click "Generate" to get AI-powered caption ideas for your post.</p>
          </div>
        )}
      </div>
      <div className="p-2 border-t border-gray-700">
        <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-red-600 text-white font-semibold py-2 px-4 rounded-md text-sm disabled:opacity-50">
          {isLoading ? 'Generating...' : 'Generate Suggestions'}
        </button>
      </div>
    </div>
  );
};

export default MagicComposePanel;
