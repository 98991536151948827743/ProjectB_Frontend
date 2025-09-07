import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserPlus, Mail, Lock, UserCircle } from "lucide-react";
import Popup from "../components/Popup";
import Loading from "../components/Loading";

const Signup = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    gender: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // only for form submit
  const [popup, setPopup] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // signup api
  const signupUser = async (data) => {
    try {
      const response = await axios.post("/api/register", data, {
        withCredentials: true,
      });
      return response.data;
    } catch (err) {
      if (!err.response) throw new Error("Server not reachable.");
      throw new Error(err.response.data?.message || "Signup failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPopup(null);

    try {
      const data = await signupUser(form);
      setPopup({
        message: data.message || "Signup successful! Check your email for OTP.",
        type: "success",
      });

      // redirect after short delay
      setTimeout(() => navigate("/verify-otp"), 1500);
    } catch (err) {
      setPopup({ message: err.message, type: "error" });
    } finally {
      setLoading(false); // ✅ stop loading after API call
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <UserPlus size={48} className="text-blue-600" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2">
          Create Account
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Sign up with your institute email
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Full Name
            </label>
            <div className="flex items-center border rounded-lg p-2">
              <UserCircle className="text-gray-400 mr-2" />
              <input
                type="text"
                name="fullName"
                placeholder="Enter your full name"
                className="flex-1 outline-none"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Email
            </label>
            <div className="flex items-center border rounded-lg p-2">
              <Mail className="text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter your institute email"
                className="flex-1 outline-none"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Gender
            </label>
            <select
              name="gender"
              className="w-full border rounded-lg p-3 outline-none"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Password
            </label>
            <div className="flex items-center border rounded-lg p-2">
              <Lock className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="flex-1 outline-none"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>

      {loading && <Loading />}
      {popup && (
        <Popup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  );
};

export default Signup;
