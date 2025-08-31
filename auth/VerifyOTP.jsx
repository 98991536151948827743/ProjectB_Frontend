import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Popup from '../components/Popup';
import Loading from '../components/Loading';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const [verified, setVerified] = useState(false); // ✅ after successful verification
  const navigate = useNavigate();

  const verifyOtp = async (userotp) => {
    try {
      const response = await axios.post(
        '/api/verify-otp',
        { userotp },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw new Error('Server is not reachable. Please try again later.');
      }
      throw new Error(error.response.data?.message || 'An unexpected error occurred.');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPopup(null);

    try {
      const data = await verifyOtp(otp);

      if (data.token) {
        localStorage.setItem('token', data.token);
      }

      // ✅ success popup (no "please login")
      setPopup({
        message: 'Email verified successfully!',
        type: 'success',
      });

      setVerified(true); // ✅ show reset/skip choice instead of redirect
    } catch (err) {
      let popupConfig = { message: err.message, type: 'error' };

      if (err.message.toLowerCase().includes('expired')) {
        popupConfig = {
          ...popupConfig,
          onButtonClick: () => navigate('/manual-verify'),
          buttonText: 'Resend OTP',
        };
      } else if (err.message.toLowerCase().includes('not found')) {
        popupConfig = {
          ...popupConfig,
          onButtonClick: () => navigate('/register'),
          buttonText: 'Register',
        };
      }
      setPopup(popupConfig);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => setPopup(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <ShieldCheck size={48} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Verify Your Email
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter the OTP sent to your email
        </p>

        {!verified ? (
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label
                htmlFor="otp"
                className="block text-gray-700 font-semibold mb-1"
              >
                OTP
              </label>
              <input
                type="text"
                id="otp"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                placeholder="Enter your OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors duration-300"
              disabled={loading}
            >
              Verify OTP
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-700 text-center font-medium">
              Do you want to update your password?
            </p>
            <button
              onClick={() => navigate('/reset-password')}
              className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reset Password
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gray-300 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Skip
            </button>
          </div>
        )}

        {!verified && (
          <div className="text-center mt-6 text-gray-600">
            <a href="/manual-verify" className="text-green-500 hover:underline">
              Didn’t get the code? Resend OTP
            </a>
          </div>
        )}
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

export default VerifyOtp;
