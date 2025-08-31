import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Popup from '../components/Popup';
import Loading from '../components/Loading';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();

  const resetPassword = async (newPassword) => {
    try {
      const response = await axios.post(
        '/api/reset-password',
        { newPassword },
        { withCredentials: true } // ✅ send cookies (resetEmail is stored there)
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw new Error('Server is not reachable. Please try again later.');
      }
      throw new Error(error.response.data?.message || 'An unexpected error occurred.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return setPopup({
        message: 'Passwords do not match!',
        type: 'error',
      });
    }

    setLoading(true);
    setPopup(null);

    try {
      const data = await resetPassword(newPassword);
      setPopup({
        message: data.message || 'Password reset successfully!',
        type: 'success',
        onButtonClick: () => navigate('/login'),
        buttonText: 'Go to Login',
      });
    } catch (err) {
      setPopup({
        message: err.message,
        type: 'error',
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
          <Lock size={48} className="text-blue-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Reset Your Password
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your new password below
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="newPassword"
              className="block text-gray-700 font-semibold mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 font-semibold mb-1"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            disabled={loading}
          >
            Reset Password
          </button>
        </form>
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

export default ResetPassword;
