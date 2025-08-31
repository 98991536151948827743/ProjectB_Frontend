import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Popup from '../components/Popup';
import Loading from '../components/Loading';

const ManualVerifyOtp = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();

  const sendOtp = async (email) => {
    try {
      const response = await axios.post(
        '/api/manual-verify',
        { email },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw new Error('Server not reachable. Please try again later.');
      }
      throw new Error(error.response.data?.message || 'Failed to send OTP.');
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPopup(null);

    try {
      const data = await sendOtp(email);

      setPopup({ message: data.message, type: 'success' });

      // after success, navigate to OTP input page
      setTimeout(() => navigate('/verify-otp'), 1500);
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
          <KeyRound size={48} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Verify Your Email
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your email to receive an OTP
        </p>

        <form onSubmit={handleSendOtp} className="space-y-6">
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
            disabled={loading}
          >
            Send OTP
          </button>
        </form>
      </div>

      {loading && <Loading />}
      {popup && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default ManualVerifyOtp;
