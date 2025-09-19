// Fix: Create the EmojiStickerPanel component.
import React, { useState, useEffect } from 'react';
// Fix: Corrected import path for apiService and added extension
import * as api from '../services/apiService.ts';

interface EmojiStickerPanelProps {
  onSelectEmoji: (emoji: string) => void;
  onSelectSticker: (stickerUrl: string) => void;
}

const EMOJIS = ['😀', '😂', '😍', '😢', '😡', '👍', '👎', '❤️', '🔥', '🎉'];

const EmojiStickerPanel: React.FC<EmojiStickerPanelProps> = ({ onSelectEmoji, onSelectSticker }) => {
  const [stickers, setStickers] = useState<string[]>([]);

  useEffect(() => {
    const fetchStickers = async () => {
        try {
            // This now correctly resolves because getStickers is added to apiService.ts
            const stickerUrls = await api.getStickers();
            setStickers(stickerUrls);
        } catch (error) {
            console.error("Failed to fetch stickers:", error);
        }
    };
    fetchStickers();
  }, []);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 w-64">
      <h4 className="font-semibold text-sm mb-2">Emojis</h4>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {EMOJIS.map(emoji => (
          <button key={emoji} onClick={() => onSelectEmoji(emoji)} className="text-2xl p-1 rounded-full hover:bg-gray-700">
            {emoji}
          </button>
        ))}
      </div>
      <h4 className="font-semibold text-sm mb-2">Stickers</h4>
       <div className="flex gap-2">
        {stickers.map(sticker => (
          <button key={sticker} onClick={() => onSelectSticker(sticker)}>
            <img src={sticker} alt="sticker" className="w-16 h-16 rounded-md hover:scale-110 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiStickerPanel;
