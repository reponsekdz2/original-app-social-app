import React from 'react';
import Icon from './Icon.tsx';

interface VerifiedBadgeProps {
  className?: string;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <span title="Verified account" className="inline-block flex-shrink-0">
        <Icon className={`${className} text-blue-400`} fill="currentColor">
           <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.757 2.847c-.996.598-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        </Icon>
    </span>
  );
};

export default VerifiedBadge;