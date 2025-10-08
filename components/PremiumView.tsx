import React from 'react';
import Icon from './Icon.tsx';

const PremiumFeature: React.FC<{ title: string; description: string; icon: React.ReactNode }> = ({ title, description, icon }) => (
  <div className="flex items-start gap-4">
    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">{icon}</div>
    <div>
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  </div>
);

const PremiumView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Unlock Premium Features</h1>
        <p className="text-lg text-gray-500 mt-2">Get the most out of our platform with an exclusive membership.</p>
      </div>

      <div className="mt-10 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <PremiumFeature 
            title="Ad-Free Experience" 
            description="Browse without interruptions. No more sponsored posts in your feed or stories."
            icon={<Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></Icon>}
          />
           <PremiumFeature 
            title="Exclusive Profile Badge" 
            description="Show off your premium status with a special badge next to your name."
            icon={<Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.602-3.751m-.228-3.447A11.96 11.96 0 0012 2.25c-2.636 0-5.053.94-6.976 2.502" /></Icon>}
          />
           <PremiumFeature 
            title="Advanced Analytics" 
            description="Get deeper insights into your posts' performance and audience engagement."
            icon={<Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-3.182-3.182m3.182 3.182v4.995A2.25 2.25 0 0119.5 19.5h-4.995" /></Icon>}
          />
        </div>
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-lg text-center">
            <h2 className="text-xl font-bold text-gray-900">Monthly Plan</h2>
            <p className="text-4xl font-extrabold my-4 text-gray-900">$9.99<span className="text-base font-normal text-gray-500">/month</span></p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg">
                Subscribe Now
            </button>
            <p className="text-xs text-gray-500 mt-4">Billed monthly. Cancel anytime.</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumView;
