import React, { useState } from 'react';
import { Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Popup from '../components/Popup';
import Loading from '../components/Loading';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();

  // ✅ Centralized login API handler inside the same file
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        '/api/login',
        {email,password},
        { withCredentials: true } // for cookies if backend uses them
      );
        console.log(response.data);
      return response.data; // assume { token, user }

    } catch (error) {
      if (!error.response) {
        throw new Error('Server is not reachable. Please try again later.');
      }
      throw new Error(error.response.data?.message || 'An unexpected error occurred.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPopup(null);

    try {
      const data = await login(email, password);

      // ✅ Save token if backend provides one
      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      setPopup({ message: 'Login successful!', type: 'success' });

      // ✅ Redirect to dashboard after short delay
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      // ✅ Map error messages to popup actions
      setPopup({
        message: err.message,
        type: 'error',
        onButtonClick: () => {
          if (err.message.toLowerCase().includes('password')) {
            navigate('/reset-password');
          } else if (err.message.toLowerCase().includes('verify')) {
            navigate('/manual-verify-otp');
          }
        },
        buttonText: err.message.toLowerCase().includes('password')
          ? 'Reset Password'
          : err.message.toLowerCase().includes('verify')
          ? 'Verify Email'
          : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => setPopup(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Mail size={48} className="text-blue-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Welcome Back
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Log in to your account
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            disabled={loading}
          >
            Log In
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Forgot password?
          </a>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Don&apos;t have an account?{' '}
            <a
              href="/register"
              className="text-blue-500 font-semibold hover:underline"
            >
              Create a new one
            </a>
          </p>
        </div>
      </div>

      {loading && <Loading />}
      {popup && (
        <Popup
          message={popup.message}
          type={popup.type}
          onButtonClick={popup.onButtonClick}
          buttonText={popup.buttonText}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default Login;
