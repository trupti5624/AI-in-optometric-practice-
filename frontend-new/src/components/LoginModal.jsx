
import React, { useState } from 'react';
// import axios from 'axios';
import { useAuth } from '../helper/AuthContext';


const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const { login, error, user } = useAuth()
  // console.log(user)
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });


  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      await login(credentials)
      onClose()
    } catch (error) {
      alert('Login failed. Check your credentials')
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Modal content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white rounded-4xl p-8 w-[400px] shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          <h2 className="text-blue-950 text-2xl font-bold mb-6">Login to VisionAI</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-600 mb-2">Email</label>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-600 mb-2">Password</label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal; // Make sure this line is present


