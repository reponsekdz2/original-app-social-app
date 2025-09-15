import React from 'react';
import Icon from './Icon';

interface VerifiedBadgeProps {
  className?: string;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <span title="Verified account" className="inline-block flex-shrink-0">
        <Icon className={`${className} text-red-500`} fill="currentColor">
            <path fillRule="evenodd" d="M12.016 2.002a2.413 2.413 0 012.368 1.125l.89 1.802.129.26a1.18 1.18 0 00.916.664l2.002.288a2.413 2.413 0 011.37 4.09l-1.45 1.408-.188.182a1.18 1.18 0 000 1.668l.188.182 1.45 1.408a2.413 2.413 0 01-1.37 4.09l-2.002.288a1.18 1.18 0 00-.916.664l-.129.26-.89 1.802a2.413 2.413 0 01-4.736 0l-.89-1.802-.129-.26a1.18 1.18 0 00-.916-.664l-2.002-.288a2.413 2.413 0 01-1.37-4.09l1.45-1.408.188-.182a1.18 1.18 0 000-1.668l-.188-.182-1.45-1.408a2.413 2.413 0 011.37-4.09l2.002-.288a1.18 1.18 0 00.916-.664l.129-.26.89-1.802A2.413 2.413 0 0112.016 2.002zM10.87 13.125a.75.75 0 01-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 011.06-1.06l1.72 1.72 1.72-1.72a.75.75 0 111.06 1.06l-1.72 1.72 1.72 1.72a.75.75 0 11-1.06 1.06l-1.72-1.72-1.72 1.72z" clipRule="evenodd" />
        </Icon>
    </span>
  );
};

export default VerifiedBadge;
