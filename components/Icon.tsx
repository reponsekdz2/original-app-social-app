import React from 'react';

interface IconProps {
  children: React.ReactNode;
  className?: string;
  fill?: string;
}

const Icon: React.FC<IconProps> = ({ children, className = 'w-6 h-6', fill = 'none' }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill={fill}
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className={className}
    >
      {children}
    </svg>
  );
};

export default Icon;