import React from 'react';
import Icon from './Icon.tsx';

interface VerifiedBadgeProps {
  className?: string;
}

const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ className = 'w-5 h-5' }) => {
  return (
    <span title="Verified account" className="inline-block flex-shrink-0">
        <Icon className={`${className} text-blue-500`} fill="currentColor">
            <path d="M10.061 1.625a2.25 2.25 0 013.878 0l.878 1.516a2.25 2.25 0 001.94 1.22l1.72-.122a2.25 2.25 0 012.43 2.43l-.122 1.72a2.25 2.25 0 001.22 1.94l1.516.878a2.25 2.25 0 010 3.878l-1.516.878a2.25 2.25 0 00-1.22 1.94l.122 1.72a2.25 2.25 0 01-2.43 2.43l-1.72-.122a2.25 2.25 0 00-1.94 1.22l-.878 1.516a2.25 2.25 0 01-3.878 0l-.878-1.516a2.25 2.25 0 00-1.94-1.22l-1.72.122a2.25 2.25 0 01-2.43-2.43l.122-1.72a2.25 2.25 0 00-1.22-1.94l-1.516-.878a2.25 2.25 0 010-3.878l1.516-.878a2.25 2.25 0 001.22-1.94l-.122-1.72a2.25 2.25 0 012.43-2.43l1.72.122a2.25 2.25 0 001.94-1.22l.878-1.516z" />
            <path fillRule="evenodd" d="M16.704 7.296a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06 0l-3.5-3.5a.75.75 0 111.06-1.06L9 14.19l6.97-6.97a.75.75 0 011.06 0z" clipRule="evenodd" />
        </Icon>
    </span>
  );
};

export default VerifiedBadge;
