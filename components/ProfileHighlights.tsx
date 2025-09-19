
import React from 'react';
// Fix: Corrected import path for types to be relative.
import type { User } from '../types.ts';
import ProfileHighlight from './ProfileHighlight.tsx';
import Icon from './Icon.tsx';

interface ProfileHighlightsProps {
  user: User;
  isCurrentUser: boolean;
  onAddNew: () => void;
}

const AddNewHighlight: React.FC<{ onAddNew: () => void }> = ({ onAddNew }) => (
  <div onClick={onAddNew} className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0">
    <div className="relative group w-28 h-40 flex flex-col items-center justify-center">
      <div className="w-full h-full rounded-xl bg-gray-800/50 border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-700/50 hover:border-gray-500 transition-colors">
        <Icon className="w-8 h-8"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></Icon>
      </div>
    </div>
    <p className="text-xs w-28 truncate text-center">Add New</p>
  </div>
);

const ProfileHighlights: React.FC<ProfileHighlightsProps> = ({ user, isCurrentUser, onAddNew }) => {
  if (!isCurrentUser && (!user.highlights || user.highlights.length === 0)) {
    return null;
  }

  return (
    <div className="px-4 py-2">
      <div className="flex space-x-4">
        {user.highlights && user.highlights.map(h => <ProfileHighlight key={h.id} highlight={h} />)}
        {isCurrentUser && <AddNewHighlight onAddNew={onAddNew} />}
      </div>
    </div>
  );
};

export default ProfileHighlights;
