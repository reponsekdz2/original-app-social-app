// Fix: Create the EmojiStickerPanel component.
import React from 'react';

interface EmojiStickerPanelProps {
  onSelectEmoji: (emoji: string) => void;
  onSelectSticker: (stickerUrl: string) => void;
}

const EMOJIS = ['😀', '😂', '😍', '😢', '😡', '👍', '👎', '❤️', '🔥', '🎉'];
const STICKERS = [
  'https://via.placeholder.com/64/ff0000/FFFFFF?text=LOL',
  'https://via.placeholder.com/64/00ff00/FFFFFF?text=OMG',
  'https://via.placeholder.com/64/0000ff/FFFFFF?text=Nice',
];

const EmojiStickerPanel: React.FC<EmojiStickerPanelProps> = ({ onSelectEmoji, onSelectSticker }) => {
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
        {STICKERS.map(sticker => (
          <button key={sticker} onClick={() => onSelectSticker(sticker)}>
            <img src={sticker} alt="sticker" className="w-16 h-16 rounded-md hover:scale-110 transition-transform" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiStickerPanel;
