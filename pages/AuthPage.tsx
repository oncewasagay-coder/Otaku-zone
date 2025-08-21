
import React, { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { useAppStore } from '../stores/useAppStore';

type AuthView = 'login' | 'register' | 'forgot';

interface AuthPageProps {
  showToast: (message: string, type: 'success' | 'error') => void;
}

const VerifyingSpinner: React.FC = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="#34D399" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="3" r="1.5"><animate attributeName="opacity" begin="0s" dur="1s" values="1;0" calcMode="discrete" repeatCount="indefinite"/></circle>
        <circle cx="18.36" cy="5.64" r="1.5" transform="rotate(45 12 12)"><animate attributeName="opacity" begin="0.125s" dur="1s" values="1;0" calcMode="discrete" repeatCount="indefinite"/></circle>
        <circle cx="21" cy="12" r="1.5" transform="rotate(90 12 12)"><animate attributeName="opacity" begin="0.25s" dur="1s" values="1;0" calcMode="discrete" repeatCount="indefinite"/></circle>
        <circle cx="18.36" cy="18.36" r="1.5" transform="rotate(135 12 12)"><animate attributeName="opacity" begin="0.375s" dur="1s" values="1;0" calcMode="discrete" repeatCount="indefinite"/></circle>
        <circle cx="12" cy="21" r="1.5" transform="rotate(180 12 12)"><animate attributeName="opacity" begin="0.5s" dur="1s" values="1;0" calcMode="discrete" repeatCount="indefinite"/></circle>
        <circle cx="5.64" cy="18.36" r="1.5" transform="rotate(225 12 12)"><animate attributeName="opacity" begin="0.625s" dur="1s" values="1;0" calcMode="discrete" repeatCount="indefinite"/></circle>
        <circle cx="3" cy="12" r="1.5" transform="rotate(270 12 12)"><animate attributeName="opacity" begin="0.75s" dur="1s" values="1;0" calcMode="discrete" repeatCount="indefinite"/></circle>
        <circle cx="5.64" cy="5.64" r="1.5" transform="rotate(315 12 12)"><animate attributeName="opacity" begin="0.875s" dur="1s" values="1;0" calcMode="discrete" repeatCount="indefinite"/></circle>
    </svg>
);

const AuthForm: React.FC<{
  view: AuthView,
  setView: (view: AuthView) => void,
  showToast: (message: string, type: 'success' | 'error') => void
}> = ({ view, setView, showToast }) => {
  const { login, register } = useAppStore();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isVerifying || isSubmitting) return;
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (view === 'login') {
      const success = await login(email, password);
      if (!success) {
        showToast('Invalid email or password.', 'error');
      }
    } else if (view === 'register') {
      const name = formData.get('name') as string;
      const success = await register(name, email, password);
      if (!success) {
        showToast('Email already in use.', 'error');
      }
    } else if (view === 'forgot') {
        showToast('If an account exists, a reset link has been sent.', 'success');
    }

    setIsSubmitting(false);
  };

  const titles = {
    login: 'Welcome back!',
    register: 'Create an Account',
    forgot: 'Reset Password',
  };

  const buttonTexts = {
    login: 'Login',
    register: 'Register',
    forgot: 'Send Reset Link'
  };

  return (
    <motion.div
        key={view}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white">{titles[view]}</h1>
        {view === 'forgot' && <p className="text-gray-400 mt-2 text-sm">Enter your email to receive a password reset link.</p>}
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        {view === 'register' && (
          <div>
            <label htmlFor="name" className="text-xs font-bold text-gray-400 tracking-wider">NAME</label>
            <input name="name" type="text" required placeholder="Shinji Ikari" className="w-full px-4 py-3 mt-1 text-gray-900 bg-white border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
          </div>
        )}
        <div>
          <label htmlFor="email" className="text-xs font-bold text-gray-400 tracking-wider">EMAIL ADDRESS</label>
          <input name="email" type="email" required placeholder="name@email.com" className="w-full px-4 py-3 mt-1 text-gray-900 bg-white border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
        </div>
        {view !== 'forgot' && (
          <div>
            <label htmlFor="password" className="text-xs font-bold text-gray-400 tracking-wider">PASSWORD</label>
            <input name="password" type="password" required placeholder="Password" className="w-full px-4 py-3 mt-1 text-gray-900 bg-white border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400" />
          </div>
        )}

        {view === 'login' && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" defaultChecked className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-400" />
              <label htmlFor="remember-me" className="ml-2 block text-gray-300">Remember me</label>
            </div>
            <div>
              <button type="button" onClick={() => setView('forgot')} className="font-medium text-pink-400 hover:text-pink-300">Forgot password?</button>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between p-3 bg-[#222222] border border-gray-700 rounded-lg">
            <div className="flex items-center gap-3 text-white">
                {isVerifying ? <VerifyingSpinner /> : <Check className="w-6 h-6 text-green-400"/>}
                <span>{isVerifying ? 'Verifying...' : 'Verified'}</span>
            </div>
            <div className="text-right">
                <span className="font-bold text-sm text-gray-300">CLOUDFLARE</span>
                <div className="text-xs text-gray-500 mt-1"><a href="#" className="hover:underline">Privacy</a> &bull; <a href="#" className="hover:underline">Terms</a></div>
            </div>
        </div>

        <div>
          <button type="submit" disabled={isVerifying || isSubmitting} className="w-full flex justify-center py-3 px-4 rounded-lg text-base font-bold text-black bg-[#f9a8d4] hover:bg-[#f472b6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#2d2d2d] focus:ring-pink-500 disabled:opacity-50 transition-colors">
            {isSubmitting ? 'Submitting...' : buttonTexts[view]}
          </button>
        </div>
      </form>
      <p className="text-sm text-center text-gray-400 mt-6">
        {view === 'login' && <>Don't have an account? <button onClick={() => setView('register')} className="font-medium text-pink-400 hover:text-pink-300">Register</button></>}
        {view === 'register' && <>Already have an account? <button onClick={() => setView('login')} className="font-medium text-pink-400 hover:text-pink-300">Login</button></>}
        {view === 'forgot' && <>Remember your password? <button onClick={() => setView('login')} className="font-medium text-pink-400 hover:text-pink-300">Login</button></>}
      </p>
    </motion.div>
  );
};

export const AuthPage: React.FC<AuthPageProps> = ({ showToast }) => {
    const [view, setView] = useState<AuthView>('login');

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#1a1a1a] p-4">
            <div className="w-full max-w-sm p-8 space-y-6 bg-[#2d2d2d] rounded-2xl shadow-2xl">
                <AnimatePresence mode="wait">
                    <AuthForm key={view} view={view} setView={setView} showToast={showToast} />
                </AnimatePresence>
            </div>
        </div>
    );
};
