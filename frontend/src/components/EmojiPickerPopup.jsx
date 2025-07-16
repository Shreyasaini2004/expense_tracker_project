import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { LuImage, LuX } from 'react-icons/lu';

const EmojiPickerPopup = ({ icon, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleEmojiClick = (emojiData) => {
    onSelect(emojiData.emoji);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-2 text-sm text-violet-600 hover:underline"
        onClick={() => setIsOpen(true)}
      >
        <LuImage className="w-5 h-5 text-violet-500" />
        {icon ? 'Change Icon' : 'Pick Icon'}
      </button>

      {isOpen && (
        <div className="absolute top-0 left-0 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <button
            className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700 transition-colors"
            onClick={() => setIsOpen(false)}
            type="button"
          >
            <LuX className="w-5 h-5" />
          </button>

          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            previewConfig={{ showPreview: false }} // ✅ No preview
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerPopup;
