import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { Car, Eye, EyeOff, Mail, Lock, User as UserIcon } from 'lucide-react'; // Added UserIcon
import { useAuth } from '../contexts/AuthContext'; // Added useAuth

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Added loading state
  const [error, setError] = useState(''); // Added error state
  const { login } = useAuth(); // Get login function from context
  const navigate = useNavigate();
  const location = useLocation(); // Get location for redirect state

  const [formData, setFormData] = useState({
    username: '', // Changed from email to username
    password: '',
    rememberMe: false
  });
  const [isShaking, setIsShaking] = useState(false);
  // const navigate = useNavigate(); // Already defined

  const handleSubmit = async (e: React.FormEvent) => { // Made async
    e.preventDefault();
    
    if (!formData.username || !formData.password) { // Changed from email to username
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }

    // Simulate login
    // Simulate login
    // console.log('Login attempt:', formData);
    // navigate('/dashboard');
    setLoading(true);
    setError('');
    try {
      await login(formData.username, formData.password); // Changed from email to username
      // Navigate to intended page or dashboard after successful login
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (err) {
      let errorMessage = 'Failed to log in. Please check your credentials.';
       if (typeof err === 'object' && err !== null && 'message' in err && typeof (err as {message: unknown}).message === 'string') {
        errorMessage = (err as {message: string}).message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      setError(errorMessage);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full shadow-2xl">
              <Car className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-4xl font-bold text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-lg text-blue-200">
            Sign in to manage your Smart Parking
          </p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg py-8 px-6 shadow-2xl rounded-2xl border border-white/20">
          <form className={`space-y-6 ${isShaking ? 'animate-shake' : ''}`} onSubmit={handleSubmit}> {/* Changed animate-pulse to animate-shake for better visual cue */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-blue-300" /> {/* Changed icon */}
                </div>
                <input
                  id="username"
                  name="username" // Changed name
                  type="text" // Changed type
                  autoComplete="username" // Changed autoComplete
                  required
                  value={formData.username} // Changed value
                  onChange={handleInputChange}
                  className="pl-10 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your username" // Changed placeholder
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-blue-300 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-blue-300 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/20 rounded bg-white/10"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-blue-200">
                  Remember me
                </label>
              </div>
              <Link to="#" className="text-sm font-medium text-blue-300 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
           {error && ( // Display error message below the form
            <p className="mt-4 text-center text-sm text-red-400 bg-red-900 bg-opacity-50 p-3 rounded-md">{error}</p>
          )}
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-blue-200">
                  New to Smart Parking?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/signup"
                className="w-full flex justify-center py-3 px-4 border border-white/20 rounded-xl shadow-sm text-sm font-medium text-white bg-white/10 hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
              >
                Create your account
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center text-xs text-blue-300">
          <p>© 2024 Smart Parking Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;