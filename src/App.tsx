import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Compiler from './components/Compiler';
import AuthPage from './components/auth/AuthPage';
import UsernameSetup from './components/auth/UsernameSetup';
import ProtectedRoute from './components/auth/ProtectedRoute';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/username-setup" element={
            <ProtectedRoute>
              <UsernameSetup />
            </ProtectedRoute>
          } />
          <Route path="/compiler" element={
            <ProtectedRoute>
              <Compiler />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Compiler />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
