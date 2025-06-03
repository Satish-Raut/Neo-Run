import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, AlertCircle, Github } from 'lucide-react';
import { loginWithEmail, loginWithGoogle, loginWithGithub, createUserDocument, db } from '../../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface LoginProps {
  onToggleForm: () => void;
}

export default function Login({ onToggleForm }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await loginWithEmail(email, password);
      navigate('/compiler');
    } catch (err: any) {
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginWithGoogle();
      
      // Create user document in Firestore for Google sign-in users
      if (result.user) {
        // Check if this user already has a username
        const userDocRef = doc(db, 'users', result.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        let needsUsernameSetup = false;
        
        if (!userDoc.exists()) {
          // First-time user - create their document
          await createUserDocument(result.user);
          needsUsernameSetup = true;
        } else {
          // Existing user - check if they have a username
          const userData = userDoc.data();
          if (!userData.username) {
            needsUsernameSetup = true;
          }
        }
        
        if (needsUsernameSetup) {
          // Redirect to username setup
          navigate('/username-setup');
        } else {
          // Regular redirect for returning users with username
          navigate('/compiler');
        }
      } else {
        navigate('/compiler');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginWithGithub();
      
      // Create user document in Firestore for GitHub sign-in users
      if (result.user) {
        // Check if this user already has a username
        const userDocRef = doc(db, 'users', result.user.uid);
        const userDoc = await getDoc(userDocRef);
        
        let needsUsernameSetup = false;
        
        if (!userDoc.exists()) {
          // First-time user - create their document
          await createUserDocument(result.user);
          needsUsernameSetup = true;
        } else {
          // Existing user - check if they have a username
          const userData = userDoc.data();
          if (!userData.username) {
            needsUsernameSetup = true;
          }
        }
        
        if (needsUsernameSetup) {
          // Redirect to username setup
          navigate('/username-setup');
        } else {
          // Regular redirect for returning users with username
          navigate('/compiler');
        }
      } else {
        navigate('/compiler');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login with GitHub. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-xl shadow-xl border border-purple-900/40">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Login to NeoRun</h1>
        <p className="mt-2 text-gray-400">
          Access your saved code snippets and more
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg">
          <div className="flex items-center text-red-400">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleEmailLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-400">Email</label>
          <div className="mt-1 relative">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 w-full py-2 bg-gray-800 border border-gray-700 rounded-lg px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
            <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-400">Password</label>
            <a href="#" className="text-sm text-purple-400 hover:text-purple-300">
              Forgot password?
            </a>
          </div>
          <div className="mt-1 relative">
            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full py-2 bg-gray-800 border border-gray-700 rounded-lg px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
            <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-2.5 px-4 flex items-center justify-center gap-2 bg-purple-600 text-white rounded-lg font-medium ${
            isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Logging in...</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              <span>Login</span>
            </>
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 text-gray-400 bg-gray-900">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button
          onClick={handleGoogleLogin}
          className="py-2.5 px-4 border border-gray-700 rounded-lg flex items-center justify-center gap-2 text-white font-medium hover:bg-gray-800 transition-colors"
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6168 0 3.1013.5978 4.236 1.5768l3.2227-3.2226C17.4565 1.3368 14.9168 0 12 0 7.3924 0 3.3967 2.6644 1.3858 6.5146l3.7227 2.8454C6.4116 6.6627 8.9661 5 12 5z"
            ></path>
            <path
              fill="#4285F4"
              d="M23.49 12.275c0-.8071-.069-1.5851-.2122-2.3315H12v4.8016h6.4757c-.2648 1.4499-1.1143 2.7583-2.4148 3.5995l3.6083 2.7998C22.0324 19.1235 23.49 16.0504 23.49 12.275z"
            ></path>
            <path
              fill="#FBBC05"
              d="M5.1085 14.3402C4.8555 13.6091 4.7143 12.8175 4.7143 12c0-.8176.1412-1.6091.3942-2.3402L1.3858 6.5146C.5042 8.1587 0 10.0162 0 12c0 1.9839.5042 3.8414 1.3858 5.4854l3.7227-2.8454z"
            ></path>
            <path
              fill="#34A853"
              d="M12 24c3.1614 0 5.8168-1.0284 7.7515-2.7651l-3.6083-2.7998c-1.0117.6677-2.3192 1.0649-4.1432 1.0649-3.0339 0-5.5884-2.0628-6.5077-4.8598l-3.7227 2.8454C3.3967 21.3357 7.3924 24 12 24z"
            ></path>
          </svg>
          <span>Login with Google</span>
        </button>

        <button
          onClick={handleGithubLogin}
          className="py-2.5 px-4 border border-gray-700 rounded-lg flex items-center justify-center gap-2 text-white font-medium hover:bg-gray-800 transition-colors"
          disabled={isLoading}
        >
          <Github className="w-5 h-5" />
          <span>Login with GitHub</span>
        </button>
      </div>

      <div className="text-center text-sm text-gray-400">
        Don't have an account?{' '}
        <button onClick={onToggleForm} className="text-purple-400 hover:underline">
          Register now
        </button>
      </div>
    </div>
  );
}