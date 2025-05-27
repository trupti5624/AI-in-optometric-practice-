import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => Cookies.get("user") || "Guest");
  const [error, setError] = useState();

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', credentials);
      console.log(response);

      if (response.status === 200) {
        setUser(response?.data?.id?.id);
        Cookies.set('user', response?.data?.id?.id, { expires: 1 });
      } else {
        alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error: ", error);
      setError(error);
    }
  };

  const signup = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/signup', credentials);
      console.log(response);

      if (response.status === 201) {
        alert("Signup successful! You can now log in.");
      } else {
        alert("Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error: ", error);
      setError(error);
    }
  };

  const logout = () => {
    setUser("Guest");
    Cookies.remove("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, error, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
