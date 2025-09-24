
import React from 'react';
import Icon from './Icon.tsx';

// Fix: Replaced JSX.Element with React.ReactNode to resolve namespace error.
const WelcomeFeature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex items-start gap-4">
    <div className="text-red-500 flex-shrink-0 mt-1">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

const AuthWelcomeContent: React.FC = () => {
  const features = [
    {
      icon: <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.056 3 11.625c0 4.556 4.03 8.25 9 8.25z" /></Icon>,
      title: 'Join the Conversation',
      description: 'Follow your interests and connect with a global community. See what people are talking about right now.',
    },
    {
      icon: <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></Icon>,
      title: 'Unleash Your Creativity',
      description: 'Share your moments with high-quality photos, videos, and stories. Express yourself in new and exciting ways.',
    },
    {
      icon: <Icon className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.18-3.468a9.75 9.75 0 01-1.12-3.468c0-4.556 4.03-8.25 9-8.25a9.75 9.75 0 018.825 5.567" /></Icon>,
      title: 'Never Miss a Moment',
      description: 'Stay connected with real-time messaging, notifications, and live video. Your community is always just a tap away.',
    },
  ];

  return (
    <div className="space-y-8 max-w-md">
        {features.map(feature => (
            <WelcomeFeature key={feature.title} {...feature} />
        ))}
    </div>
  );
};

export default AuthWelcomeContent;
