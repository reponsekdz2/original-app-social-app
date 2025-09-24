import React, { useState } from 'react';
import Icon from './Icon.tsx';
import * as geminiService from '../services/geminiService.ts';

interface MagicComposePanelProps {
  onSelectSuggestion: (suggestion: string) => void;
}

const MagicComposePanel: React.FC<MagicComposePanelProps> = ({ onSelectSuggestion }) => {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await geminiService.getComposeSuggestions(prompt);
      setSuggestions(result);
    } catch (error) {
      console.error("Failed to get suggestions", error);
      setSuggestions(["Error generating suggestions."]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-80 h-96 flex flex-col">
      <div className="p-3 border-b border-gray-700">
        <h3 className="font-bold text-center">Magic Compose</h3>
      </div>
      <div className="p-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What do you want to say? (e.g., 'a funny way to say hi')"
          className="w-full bg-gray-700 p-2 rounded-md text-sm resize-none h-24 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md disabled:bg-gray-600 flex items-center justify-center"
        >
          {isLoading ? (
            <div className="sk-chase" style={{ width: '20px', height: '20px' }}>
              <div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div><div className="sk-chase-dot"></div><div className="sk-chase-dot"></div>
            </div>
          ) : (
            <>
              <Icon className="w-5 h-5 mr-2"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></Icon>
              Generate
            </>
          )}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 border-t border-gray-700 space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => onSelectSuggestion(suggestion)}
            className="w-full text-left p-2 bg-gray-700/50 hover:bg-gray-700 rounded-md text-sm"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MagicComposePanel;
