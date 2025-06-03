import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Login from './Login';
import Register from './Register';
import NavBar from '../NavBar';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const { currentUser } = useAuth();

  // If user is already logged in, redirect to compiler
  if (currentUser) {
    return <Navigate to="/compiler" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white flex flex-col">
      {/* Use NavBar instead of custom header */}
      <NavBar />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          {isLoginView ? (
            <Login onToggleForm={() => setIsLoginView(false)} />
          ) : (
            <Register onToggleForm={() => setIsLoginView(true)} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} NeoRun. All rights reserved.</p>
      </footer>
    </div>
  );
}