

import React from 'react';
// Fix: Corrected import path for types to be relative.
import type { SponsoredContent } from '../types.ts';
import Icon from './Icon.tsx';

interface SponsoredPostProps {
  ad: SponsoredContent;
}

const SponsoredPost: React.FC<SponsoredPostProps> = ({ ad }) => {
  return (
    <a href={ad.link} target="_blank" rel="noopener noreferrer" className="block hover:bg-gray-900 rounded-lg p-1 transition-colors">
      <div className="flex items-center gap-3">
        {/* Fix: Property 'logo' does not exist on type 'SponsoredContent'. */}
        <img src={ad.logo_url} alt={ad.company} className="w-12 h-12 rounded-full object-cover" />
        <div>
          <p className="font-semibold text-sm">{ad.company}</p>
          <p className="text-xs text-gray-500">Sponsored</p>
        </div>
      </div>
    </a>
  );
};

export default SponsoredPost;