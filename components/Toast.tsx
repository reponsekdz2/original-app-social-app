
import React, { useEffect } from 'react';
import Icon from './Icon.tsx';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const style = {
    success: { bg: 'bg-green-500', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> },
    error: { bg: 'bg-red-500', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /> },
    info: { bg: 'bg-blue-500', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.852l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /> },
  }[type];

  return (
    <div className={`fixed bottom-5 right-5 ${style.bg} text-white py-3 px-5 rounded-lg flex items-center shadow-lg animate-fade-in`}>
      <Icon className="w-6 h-6 mr-3">{style.icon}</Icon>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 p-1">
        <Icon className="w-5 h-5"><path d="M6 18L18 6M6 6l12 12" /></Icon>
      </button>
    </div>
  );
};

export default Toast;
