import { useState, useEffect } from 'react';
import { UserPlus, Mail, Lock, AlertCircle, User, AtSign } from 'lucide-react';
import { registerWithEmail, updateUserProfile, createUserDocument, checkUsernameAvailability } from '../../services/firebase';

interface RegisterProps {
  onToggleForm: () => void;
}

export default function Register({ onToggleForm }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

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
      // Create user with email and password
      const userCredential = await registerWithEmail(email, password);
      
      // Update profile with display name
      if (userCredential.user) {
        await updateUserProfile(userCredential.user, name);
        
        // Create user document in Firestore with username
        await createUserDocument(userCredential.user, username);
      }

      // Registration successful - redirect will happen automatically due to auth state change
    } catch (err: any) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 rounded-xl shadow-xl border border-purple-900/40">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white">Create an Account</h1>
        <p className="mt-2 text-gray-400">
          Join NeoRun to save and share code snippets
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

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-400">Full Name</label>
          <div className="mt-1 relative">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pl-10 w-full py-2 bg-gray-800 border border-gray-700 rounded-lg px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
            <User className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Username</label>
          <div className="mt-1 relative">
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
          <label className="block text-sm font-medium text-gray-400">Password</label>
          <div className="mt-1 relative">
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full py-2 bg-gray-800 border border-gray-700 rounded-lg px-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
              minLength={6}
            />
            <Lock className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 6 characters long
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400">Confirm Password</label>
          <div className="mt-1 relative">
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5" />
              <span>Register</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <button onClick={onToggleForm} className="text-purple-400 hover:underline">
          Login now
        </button>
      </div>
    </div>
  );
}