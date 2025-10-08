import React, { useState } from 'react';
import LoginForm from './LoginForm.tsx';
import RegisterForm from './RegisterForm.tsx';
import ForgotPasswordModal from './ForgotPasswordModal.tsx';
import AuthImageCarousel from './AuthImageCarousel.tsx';
import type { User } from '../types.ts';
import TwoFactorAuthLoginModal from './TwoFactorAuthLoginModal.tsx';

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

  return (
    <div className="min-h-screen text-gray-800 flex items-center justify-center p-4 overflow-hidden bg-gray-100">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center justify-center w-full animate-slide-fade-in">
        
        {/* Carousel (Left) - Visible on large screens */}
        <div className="hidden lg:flex justify-center">
          <AuthImageCarousel />
        </div>

        {/* Form (Right) */}
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white border border-gray-200 p-8 rounded-xl shadow-lg max-h-[95vh] h-auto overflow-y-auto scrollbar-hide">
            <div className="relative h-auto">
              <div className={`transition-opacity duration-500 ease-in-out ${isLoginView ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
                 <LoginForm 
                  onLoginSuccess={onLoginSuccess} 
                  onLoginNeeds2FA={handleLoginNeeds2FA}
                  onSwitchToRegister={() => setIsLoginView(false)} 
                  onForgotPassword={() => setForgotPasswordOpen(true)}
                />
              </div>
               <div className={`transition-opacity duration-500 ease-in-out absolute inset-0 ${!isLoginView ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
                  <RegisterForm 
                    onRegisterSuccess={(data) => onLoginSuccess({...data, isNewUser: true})} 
                    onSwitchToLogin={() => setIsLoginView(true)}
                  />
               </div>
            </div>
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