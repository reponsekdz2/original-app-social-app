import React, { useState } from 'react';
import LoginForm from './components/LoginForm.tsx';
import RegisterForm from './components/RegisterForm.tsx';
import ForgotPasswordModal from './components/ForgotPasswordModal.tsx';
import AuthImageCarousel from './components/AuthImageCarousel.tsx';
import AuthWelcomeContent from './components/AuthWelcomeContent.tsx';

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
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-16">
        <div className="hidden lg:block">
          <AuthImageCarousel />
        </div>
        <div className="w-full max-w-sm">
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg">
            {isLoginView ? (
              <LoginForm 
                onLoginSuccess={onLoginSuccess} 
                onSwitchToRegister={() => setIsLoginView(false)} 
                onForgotPassword={() => setForgotPasswordOpen(true)}
              />
            ) : (
              <RegisterForm 
                onRegisterSuccess={onLoginSuccess} 
                onSwitchToLogin={() => setIsLoginView(true)}
              />
            )}
          </div>
        </div>
         <div className="hidden xl:block">
           <AuthWelcomeContent />
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
