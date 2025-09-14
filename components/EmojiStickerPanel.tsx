// Fix: Create the EmojiStickerPanel component.
import React from 'react';

interface EmojiStickerPanelProps {
  onSelectEmoji: (emoji: string) => void;
}

const EMOJIS = ['😂', '❤️', '🔥', '👍', '😢', '🙏', '🎉', '🤯'];

const EmojiStickerPanel: React.FC<EmojiStickerPanelProps> = ({ onSelectEmoji }) => {
  return (
    <div className="bg-gray-800 p-2 rounded-lg shadow-lg">
      <div className="grid grid-cols-4 gap-2">
        {EMOJIS.map(emoji => (
          <button
            key={emoji}
            onClick={() => onSelectEmoji(emoji)}
            className="text-2xl p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiStickerPanel;
