
import React from 'react';

interface IconProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Icon: React.FC<IconProps> = ({ children, className = '', onClick }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`w-6 h-6 ${className}`}
      onClick={onClick}
    >
      {children}
    </svg>
  );
};

export default Icon;
