import React from 'react';
import Icon from './Icon.tsx';

const features = [
    {
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />,
        title: "Cinematic Content",
        description: "Share your life's highlights in stunning video and photo formats."
    },
    {
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />,
        title: "AI-Powered Creativity",
        description: "Generate captions and comments with a touch of magic."
    },
    {
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.18-3.468a9.75 9.75 0 01-1.12-3.468c0-4.556 4.03-8.25 9-8.25a9.75 9.75 0 018.825 5.567" />,
        title: "Connect with Fans",
        description: "Build your community with a full-featured messaging system."
    }
];

const AuthWelcomeContent: React.FC = () => {
    return (
        <div className="text-white text-center">
            <h2 className="text-4xl font-bold mb-4 animate-fade-in" style={{ animationDelay: '100ms' }}>
                Join a World of Stories.
            </h2>
            <p className="text-gray-300 mb-10 animate-fade-in" style={{ animationDelay: '300ms' }}>
                Capture and share moments inspired by your favorite shows and movies.
            </p>
            <div className="space-y-6">
                {features.map((feature, index) => (
                    <div 
                        key={feature.title} 
                        className="flex items-start text-left gap-4 animate-fade-in" 
                        style={{ animationDelay: `${500 + index * 200}ms` }}
                    >
                        <div className="flex-shrink-0 bg-red-600/20 text-red-500 p-3 rounded-full">
                            <Icon className="w-6 h-6">{feature.icon}</Icon>
                        </div>
                        <div>
                            <h3 className="font-semibold">{feature.title}</h3>
                            <p className="text-sm text-gray-400">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AuthWelcomeContent;
