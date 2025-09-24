import React, { useState } from 'react';
import LoginForm from './LoginForm.tsx';
import RegisterForm from './RegisterForm.tsx';
import ForgotPasswordModal from './ForgotPasswordModal.tsx';
import AuthImageCarousel from './AuthImageCarousel.tsx';
import AuthWelcomeContent from './AuthWelcomeContent.tsx';

interface AuthViewProps {
  onLoginSuccess: (data: { user: any }) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLoginSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);

  const handleForgotPasswordSubmit = async (email: string) => {
    // In a real app, this would call an API
    console.log('Password reset requested for:', email);
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-16">
        {/* Left Side: Visuals - hidden on small screens */}
        <div className="hidden lg:flex flex-col items-center justify-center gap-8">
          <AuthImageCarousel />
          <AuthWelcomeContent />
        </div>

        {/* Right Side: Forms */}
        <div className="w-full max-w-sm flex items-center justify-center py-8">
          <div className="w-full">
            <div className="bg-gray-900/50 border border-gray-800 p-8 rounded-xl backdrop-blur-sm">
              <div className="relative min-h-[520px]">
                <div className={`transition-opacity duration-500 ease-in-out absolute inset-0 ${isLoginView ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
                   <LoginForm 
                    onLoginSuccess={onLoginSuccess} 
                    onSwitchToRegister={() => setIsLoginView(false)} 
                    onForgotPassword={() => setForgotPasswordOpen(true)}
                  />
                </div>
                 <div className={`transition-opacity duration-500 ease-in-out absolute inset-0 ${!isLoginView ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'}`}>
                    <RegisterForm 
                      onRegisterSuccess={onLoginSuccess} 
                      onSwitchToLogin={() => setIsLoginView(true)}
                    />
                 </div>
              </div>
            </div>
            
             <div className="mt-4 bg-gray-900/50 border border-gray-800 p-4 rounded-xl backdrop-blur-sm text-center text-sm">
                <p>
                  {isLoginView ? "Don't have an account?" : "Have an account?"}{' '}
                  <button onClick={() => setIsLoginView(!isLoginView)} className="font-semibold text-red-500 hover:underline">
                    {isLoginView ? "Sign up" : "Log in"}
                  </button>
                </p>
            </div>
          </div>
        </div>
      </div>

      {isForgotPasswordOpen && (
        <ForgotPasswordModal
          onClose={() => setForgotPasswordOpen(false)}
          onSubmit={handleForgotPasswordSubmit}
        />
      )}
    </div>
  );
};

export default AuthView;