import React, { useState, useEffect } from 'react';
import { rewriteMessage } from '../services/geminiService';
import Icon from './Icon';

interface MagicComposePanelProps {
  originalText: string;
  onSelectSuggestion: (suggestion: string) => void;
  onClose: () => void;
}

const MagicComposePanel: React.FC<MagicComposePanelProps> = ({ originalText, onSelectSuggestion, onClose }) => {
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});
  const [loadingTone, setLoadingTone] = useState<string | null>(null);

  const tones: ('formal' | 'casual')[] = ['formal', 'casual'];

  const generateSuggestion = async (tone: 'formal' | 'casual') => {
    if (suggestions[tone] || loadingTone) return; // Already have it or something is loading
    setLoadingTone(tone);
    try {
      const rewritten = await rewriteMessage(originalText, tone);
      setSuggestions(prev => ({ ...prev, [tone]: rewritten }));
    } catch (error) {
      console.error(`Failed to generate ${tone} suggestion:`, error);
      // Optionally, set an error state to show in the UI
    } finally {
      setLoadingTone(null);
    }
  };

  useEffect(() => {
    // Reset suggestions when original text changes
    setSuggestions({});
  }, [originalText]);


  return (
    <div className="absolute bottom-full left-4 right-4 mb-2 p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold flex items-center gap-2">
                <Icon className="w-5 h-5 text-red-400"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></Icon>
                Magic Compose
            </h3>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700">
                <Icon className="w-5 h-5 text-gray-400"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></Icon>
            </button>
        </div>
        
        <div className="flex gap-2 mb-2">
            {tones.map(tone => (
                <button 
                    key={tone}
                    onClick={() => generateSuggestion(tone)}
                    className="text-xs font-semibold px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full capitalize"
                    disabled={!!loadingTone}
                >
                    {tone}
                </button>
            ))}
        </div>

        <div className="space-y-2 max-h-40 overflow-y-auto">
            {tones.map(tone => {
                if (loadingTone === tone) {
                    return (
                        <div key={tone} className="p-2 bg-gray-700/50 rounded-md text-sm text-gray-400 animate-pulse">
                            Generating {tone} version...
                        </div>
                    );
                }
                if (suggestions[tone]) {
                    return (
                        <div 
                            key={tone} 
                            onClick={() => onSelectSuggestion(suggestions[tone])}
                            className="p-2 bg-gray-700 rounded-md cursor-pointer hover:bg-gray-600"
                        >
                            <p className="text-sm font-semibold capitalize text-red-400">{tone}</p>
                            <p className="text-sm">{suggestions[tone]}</p>
                        </div>
                    );
                }
                return null;
            })}
        </div>
    </div>
  );
};

export default MagicComposePanel;
