import React from 'react';
import type { Testimonial } from '../types.ts';
import Icon from './Icon.tsx';
import VerifiedBadge from './VerifiedBadge.tsx';

interface PremiumViewProps {
  testimonials: Testimonial[];
  onSubscribe: () => void;
}

const PremiumView: React.FC<PremiumViewProps> = ({ testimonials, onSubscribe }) => {
  const features = [
    'Verified Badge',
    'Magic Compose AI',
    '4K UHD Video Uploads',
    'Ad-Free Experience',
    'Priority Support',
    'Exclusive Content',
  ];

  return (
    <div className="p-4 md:p-8 min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-serif tracking-wide">Unlock Premium</h1>
          <p className="text-lg text-gray-300 mb-8">Elevate your experience with exclusive features designed for creators and fans.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">What you get</h2>
            <ul className="space-y-4">
              {features.map(feature => (
                <li key={feature} className="flex items-center gap-3">
                  <Icon className="w-6 h-6 text-red-500"><path fillRule="evenodd" clipRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm4.28 6.22a.75.75 0 00-1.06-1.06L11 11.69l-1.72-1.72a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.5-4.5z" /></Icon>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={onSubscribe}
              className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform hover:scale-105"
            >
              Subscribe for $95.99/year
            </button>
            <p className="text-xs text-gray-500 mt-4 text-center">Billed annually. Cancel anytime.</p>
          </div>
          <div className="space-y-4 hidden md:block">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl">
                <p className="text-gray-300 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={testimonial.user.avatar} alt={testimonial.user.username} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="font-semibold flex items-center gap-1.5">{testimonial.user.name} {testimonial.user.isVerified && <VerifiedBadge />}</p>
                    <p className="text-sm text-gray-400">@{testimonial.user.username}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumView;
