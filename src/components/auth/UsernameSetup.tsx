import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AtSign, AlertCircle } from 'lucide-react';
import { updateUsername, checkUsernameAvailability } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import NavBar from '../NavBar';

export default function UsernameSetup() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Auto-suggest username from user's display name or email
  useEffect(() => {
    if (currentUser) {
      let suggestedUsername = '';
      
      if (currentUser.displayName) {
        // Remove spaces and special characters
        suggestedUsername = currentUser.displayName
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/[^a-z0-9_]/g, '');
      } else if (currentUser.email) {
        // Use email part before @
        suggestedUsername = currentUser.email.split('@')[0];
      }
      
      setUsername(suggestedUsername);
    }
  }, [currentUser]);

  // Check username availability with debounce
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setUsernameAvailable(false);
      return;
    }

    const checkAvailability = async () => {
      setUsernameChecking(true);
      try {
        const isAvailable = await checkUsernameAvailability(username);
        setUsernameAvailable(isAvailable);
      } catch (err) {
        console.error("Error checking username:", err);
        setUsernameAvailable(null);
      } finally {
        setUsernameChecking(false);
      }
    };

    const timeoutId = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate username
    if (!username || username.length < 3) {
      setError('Username must be at least 3 characters long');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    if (usernameAvailable !== true) {
      setError('Username is not available. Please choose another.');
      return;
    }

    setIsLoading(true);

    try {
      if (!currentUser) {
        throw new Error('You must be logged in to set a username');
      }
      
      // Update the username
      const success = await updateUsername(currentUser.uid, username);
      
      if (!success) {
        throw new Error('Failed to update username. Please try again.');
      }

      setIsSuccess(true);
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to set username. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!currentUser) {
    // Redirect to login if not authenticated
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <NavBar />
      
      <main className="max-w-md mx-auto mt-10 p-4">
        <div className="bg-gray-900 rounded-xl shadow-xl border border-purple-900/40 p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">Choose Your Username</h1>
            <p className="text-gray-400">
              Select a unique username for your NeoRun profile
            </p>
          </div>
          
          {error && (
            <div className="p-3 mb-4 bg-red-900/30 border border-red-800 rounded-lg">
              <div className="flex items-center text-red-400">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {isSuccess && (
            <div className="p-3 mb-4 bg-green-900/30 border border-green-800 rounded-lg">
              <div className="flex items-center text-green-400">
                <span>Username set successfully! Redirecting...</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Choose a unique username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.trim())}
                  className={`pl-10 w-full py-2 bg-gray-800 border ${
                    usernameAvailable === true 
                      ? 'border-green-500' 
                      : usernameAvailable === false 
                        ? 'border-red-500' 
                        : 'border-gray-700'
                  } rounded-lg px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                  minLength={3}
                  required
                  disabled={isLoading || isSuccess}
                />
                <AtSign className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
                
                {usernameChecking && (
                  <span className="text-xs text-gray-400 mt-1 absolute right-3 top-3">
                    Checking...
                  </span>
                )}
                
                {!usernameChecking && username.length >= 3 && (
                  <span className={`text-xs ${usernameAvailable ? 'text-green-400' : 'text-red-400'} mt-1 absolute right-3 top-3`}>
                    {usernameAvailable ? 'Available' : 'Unavailable'}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Username will be used for your public profile (only letters, numbers, and underscores)
              </p>
            </div>

            <div className="flex justify-between items-center mt-6">
              <p className="text-xs text-gray-400">
                Your profile URL: neocompiler.com/<span className="text-purple-400">{username || 'username'}</span>
              </p>
              
              <button
                type="submit"
                className={`py-2 px-4 bg-purple-600 text-white rounded-lg ${
                  isLoading || isSuccess ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-700'
                } transition-colors`}
                disabled={isLoading || isSuccess}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </div>
                ) : isSuccess ? (
                  'Success!'
                ) : (
                  'Confirm'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6 pt-4 border-t border-gray-800">
            <p className="text-sm text-gray-400 mb-2">
              Why choose a username?
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Create a recognizable identity in the NeoRun community</li>
              <li>• Let others easily find and follow your shared code snippets</li>
              <li>• Get credit when people use your public snippets</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}