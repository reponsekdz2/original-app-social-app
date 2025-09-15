import React from 'react';
import Icon from './Icon.tsx';

interface MagicComposePanelProps {
  onGenerate: (style: string) => void;
  isLoading: boolean;
}

const styles = ['Casual', 'Formal', 'Witty', 'Poetic', 'Excited'];

const MagicComposePanel: React.FC<MagicComposePanelProps> = ({ onGenerate, isLoading }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 w-56">
        <div className="flex items-center justify-between mb-2 px-1">
            <p className="font-semibold text-sm">✨ Magic Compose</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
            {styles.map(style => (
                <button 
                    key={style}
                    onClick={() => onGenerate(style)}
                    disabled={isLoading}
                    className="text-sm p-2 rounded-md bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 disabled:text-gray-500 transition-colors"
                >
                    {style}
                </button>
            ))}
             <button
                onClick={() => onGenerate('remix')}
                disabled={isLoading}
                className="col-span-2 text-sm p-2 rounded-md bg-gradient-to-r from-purple-500 to-red-500 text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
               Remix
            </button>
        </div>
    </div>
  );
};

export default MagicComposePanel;
