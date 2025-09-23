
import React from 'react';

interface ConfirmationModalProps {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, confirmText, cancelText, onConfirm, onCancel, isDestructive = false }) => {
  const confirmButtonClasses = isDestructive
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-blue-600 hover:bg-blue-700';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onCancel}>
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-sm border border-gray-700 text-center p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-2">{title}</h2>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={onConfirm}
            className={`w-full py-2.5 font-semibold text-white rounded-md ${confirmButtonClasses}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2.5 font-semibold bg-gray-600 hover:bg-gray-500 text-white rounded-md"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
