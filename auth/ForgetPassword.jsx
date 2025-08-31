import React, { useState } from "react";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Popup from "../components/Popup";
import Loading from "../components/Loading";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(null);
  const navigate = useNavigate();

  // ✅ API call for forgot password
  const forgotPassword = async (email) => {
    try {
      const response = await axios.post(
        "/api/forget-password",
        { email },
        { withCredentials: true } // needed for cookies
      );
      return response.data;
    } catch (error) {
      if (!error.response) {
        throw new Error("Server is not reachable. Please try again later.");
      }
      throw new Error(error.response.data?.message || "Something went wrong.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPopup(null);

    try {
      const data = await forgotPassword(email);

      setPopup({
        message: data.message || "OTP sent successfully!",
        type: "success",
      });

      // Navigate to OTP verify page after short delay
      setTimeout(() => navigate("/verify-otp"), 1500);
    } catch (err) {
      setPopup({
        message: err.message,
        type: "error",
        buttonText: err.message.includes("User not found") ? "Register" : "Retry",
        onButtonClick: () => {
          if (err.message.includes("User not found")) {
            navigate("/register");
          } else {
            setPopup(null);
          }
        },
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
          Forgot Password?
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Enter your registered email. We’ll send you an OTP to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
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
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            disabled={loading}
          >
            Send OTP
          </button>
        </form>

        <div className="text-center mt-6 text-gray-600">
          <a href="/login" className="text-blue-500 hover:underline">
            Back to Login
          </a>
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

export default ForgotPassword;
