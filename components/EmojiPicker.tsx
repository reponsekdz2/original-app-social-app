import React from 'react';

interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

const EMOJIS = ['❤️', '😂', '🔥', '👍', '😢', '😍', '👏', '🤯', '💯', '🤔', '😎', '🎉'];

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji }) => {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-2">
        <div className="grid grid-cols-6 gap-1">
            {EMOJIS.map(emoji => (
                <button 
                    key={emoji}
                    onClick={() => onSelectEmoji(emoji)}
                    className="text-2xl p-1 rounded-full hover:bg-gray-700 transform hover:scale-125 transition-transform"
                >
                    {emoji}
                </button>
            ))}
        </div>
    </div>
  );
};

export default EmojiPicker;