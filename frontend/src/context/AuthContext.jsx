import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Agar local storage mein token hai, toh page refresh par bhi state login rahegi
    if (token) {
      localStorage.setItem('token', token);
      // Optional: Aap yahan backend par ek '/me' endpoint maar kar user details verify bhi kar sakte ho
    } else {
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, [token]);

  const login = (jwtToken, userData) => {
    setToken(jwtToken);
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};