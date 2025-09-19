

import React, { useState, useEffect } from 'react';
// Fix: Corrected import path for apiService to be relative.
import * as api from '../services/apiService';

interface EmojiStickerPanelProps {
  onSelectEmoji: (emoji: string) => void;
  onSelectSticker: (stickerUrl: string) => void;
}

const EMOJIS = ['😀', '😂', '😍', '😢', '😡', '👍', '👎', '❤️', '🔥', '🎉'];

const EmojiStickerPanel: React.FC<EmojiStickerPanelProps> = ({ onSelectEmoji, onSelectSticker }) => {
  const [stickers, setStickers] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'emoji' | 'sticker'>('emoji');

  useEffect(() => {
    const fetchStickers = async () => {
        try {
            const stickerUrls = await api.getStickers();
            setStickers(stickerUrls);
        } catch (error) {
            console.error("Failed to fetch stickers:", error);
        }
    };
    fetchStickers();
  }, []);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl w-72 h-80 flex flex-col">
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'emoji' && (
             <div className="grid grid-cols-6 gap-2">
                {EMOJIS.map(emoji => (
                <button key={emoji} onClick={() => onSelectEmoji(emoji)} className="text-3xl p-1 rounded-full hover:bg-gray-700">
                    {emoji}
                </button>
                ))}
            </div>
        )}
        {activeTab === 'sticker' && (
            <div className="grid grid-cols-3 gap-2">
                {stickers.map(sticker => (
                <button key={sticker} onClick={() => onSelectSticker(sticker)}>
                    <img src={sticker} alt="sticker" className="w-full h-full object-contain rounded-md hover:scale-110 transition-transform" />
                </button>
                ))}
            </div>
        )}
      </div>
      <div className="flex border-t border-gray-700">
        <button onClick={() => setActiveTab('emoji')} className={`flex-1 p-2 text-sm font-semibold ${activeTab === 'emoji' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}>Emojis</button>
        <button onClick={() => setActiveTab('sticker')} className={`flex-1 p-2 text-sm font-semibold ${activeTab === 'sticker' ? 'bg-gray-700' : 'hover:bg-gray-700/50'}`}>Stickers</button>
      </div>
    </div>
  );
};

export default EmojiStickerPanel;