import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onDismiss }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(onDismiss, 500); // Wait for fade-out animation to complete
    }, 3000); // Toast visible for 3 seconds

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`bg-gray-800 text-white py-2 px-5 rounded-full shadow-lg text-sm transition-all duration-500 ease-in-out transform ${
        isFadingOut ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
