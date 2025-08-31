import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from '../auth/login';
import ManualVerifyOtp from '../auth/ManualVerify';
import VerifyOtp from '../auth/VerifyOTP';
import ForgotPassword from '../auth/ForgetPassword';
import ResetPassword from '../auth/ResetPassword';
import Signup from '../auth/Singup';


// Main App component to handle routing.
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login/>}/>
        <Route path='/manual-verify-otp' element= {<ManualVerifyOtp/>}/>
        <Route path='/verify-otp' element= {<VerifyOtp/>}/>
        <Route path='/forgot-password' element= {<ForgotPassword/>}/>
        <Route path='/reset-password' element= {<ResetPassword/>}/>
        <Route path='/register' element= {<Signup/>}/>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

// Component for the home page.
const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg transform transition-all hover:scale-105 duration-300 w-full max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-4">
          Welcome to the Home Page!
        </h1>
        <p className="text-gray-700 text-lg mb-6">
          This is a simple example of a React app with routing.
        </p>
        <nav className="flex items-center justify-center space-x-4">
          <Link
            to="/some-valid-path"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Go to a Valid Path
          </Link>
          <Link
            to="/non-existent-path"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Go to a Bad Path
          </Link>
        </nav>
      </div>
    </div>
  );
};

// Component for the "Page Not Found" error.
const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-6xl font-extrabold text-red-600 mb-4 animate-bounce">
          404
        </h1>
        <p className="text-2xl font-semibold text-gray-800 mb-2">
          Page Not Found
        </p>
        <p className="text-gray-600 mb-6">
          The page you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
        >
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default App;
