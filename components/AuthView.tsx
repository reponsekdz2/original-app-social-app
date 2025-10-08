import React, { useState } from 'react';
import LoginForm from './LoginForm.tsx';
import RegisterForm from './RegisterForm.tsx';
import ForgotPasswordModal from './ForgotPasswordModal.tsx';
import type { User } from '../types.ts';
import TwoFactorAuthLoginModal from './TwoFactorAuthLoginModal.tsx';
import TypingEffect from './TypingEffect.tsx';
import Icon from './Icon.tsx';

interface AuthViewProps {
  onLoginSuccess: (data: { user: User, isNewUser?: boolean }) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [is2FAModalOpen, set2FAModalOpen] = useState(false);
  const [userFor2FA, setUserFor2FA] = useState<User | null>(null);

  const handleForgotPasswordSubmit = async (email: string) => {
    // In a real app, this would call an API
    console.log('Password reset requested for:', email);
    setForgotPasswordOpen(false);
  };

  const handleLoginNeeds2FA = (user: User) => {
    setUserFor2FA(user);
    set2FAModalOpen(true);
  };
  
  const handle2FASubmit = (code: string) => {
    // In a real app, verify the code
    console.log(`Verifying 2FA code ${code} for user ${userFor2FA?.username}`);
    if(userFor2FA) {
        onLoginSuccess({ user: userFor2FA });
    }
    set2FAModalOpen(false);
  };

  const featureWords = [
    "Share your moments.",
    "Connect with friends.",
    "Discover new trends.",
    "Go live.",
    "Create your story.",
  ];

  const features = [
      { icon: <Icon className="w-6 h-6"><path d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" /></Icon>, text: "Share photos & videos" },
      { icon: <Icon className="w-6 h-6"><path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" /></Icon>, text: "Watch short-form Reels" },
      { icon: <Icon className="w-6 h-6"><path d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></Icon>, text: "Create ephemeral Stories" },
      { icon: <Icon className="w-6 h-6"><path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.388m-5.18-3.468a9.75 9.75 0 01-1.12-3.468c0-4.556 4.03-8.25 9-8.25a9.75 9.75 0 018.825 5.567" /></Icon>, text: "Chat with your friends" },
  ];

  return (
    <div className="min-h-screen text-gray-800 flex flex-col items-center justify-center p-4 bg-gray-50">
       <div className="w-full max-w-lg text-center mb-8 animate-slide-fade-in">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">talka</h1>
        <div className="h-8">
            <TypingEffect words={featureWords} className="text-2xl text-gray-600" />
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg h-auto overflow-y-auto scrollbar-hide">
          {isLoginView ? (
              <LoginForm 
                onLoginSuccess={onLoginSuccess} 
                onLoginNeeds2FA={handleLoginNeeds2FA}
                onSwitchToRegister={() => setIsLoginView(false)} 
                onForgotPassword={() => setForgotPasswordOpen(true)}
              />
          ) : (
              <RegisterForm 
                onRegisterSuccess={(data) => onLoginSuccess({...data, isNewUser: true})} 
                onSwitchToLogin={() => setIsLoginView(true)}
              />
          )}
        </div>
        
         <div className="mt-4 bg-white border border-gray-200 p-4 rounded-xl shadow-lg text-center text-sm">
            <p>
              {isLoginView ? "Don't have an account?" : "Have an account?"}{' '}
              <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-blue-600 hover:underline">
                {isLoginView ? "Sign up" : "Log in"}
              </button>
            </p>
        </div>
      </div>

       <div className="w-full max-w-2xl mx-auto mt-12 text-center">
         <h3 className="font-semibold text-gray-500 mb-4">Join a community of creators and friends.</h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-700">
             {features.map(feature => (
                 <div key={feature.text} className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                     {feature.icon}
                     <span className="text-xs mt-2 font-medium">{feature.text}</span>
                 </div>
             ))}
         </div>
      </div>


      {isForgotPasswordOpen && (
        <ForgotPasswordModal
          onClose={() => setForgotPasswordOpen(false)}
          onSubmit={handleForgotPasswordSubmit}
        />
      )}
      {is2FAModalOpen && (
        <TwoFactorAuthLoginModal
            onClose={() => set2FAModalOpen(false)}
            onSubmit={handle2FASubmit}
        />
      )}
    </div>
  );
};

export default AuthView;