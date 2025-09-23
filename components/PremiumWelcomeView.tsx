
import React from 'react';
import Icon from './Icon.tsx';

interface PremiumWelcomeViewProps {
    onDone: () => void;
}

const PremiumWelcomeView: React.FC<PremiumWelcomeViewProps> = ({ onDone }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Icon className="w-24 h-24 text-red-500 mb-4">
                <path fill="currentColor" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.321h5.367a.563.563 0 01.321.988l-4.338 3.14a.563.563 0 00-.184.55l1.637 5.111a.563.563 0 01-.812.622l-4.338-3.14a.563.563 0 00-.576 0l-4.338 3.14a.563.563 0 01-.812-.622l1.637-5.111a.563.563 0 00-.184-.55l-4.338-3.14a.563.563 0 01.321-.988h5.367a.563.563 0 00.475-.321L11.48 3.5z" />
            </Icon>
            <h1 className="text-3xl font-bold">Welcome to Premium!</h1>
            <p className="text-gray-400 mt-2 max-w-md">Your premium features are now active. Enjoy an ad-free experience, a special profile badge, and advanced analytics.</p>
            <button onClick={onDone} className="mt-8 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full">
                Explore Features
            </button>
        </div>
    );
};

export default PremiumWelcomeView;
