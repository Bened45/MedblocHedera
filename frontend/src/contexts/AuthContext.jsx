import React, { createContext, useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login as apiLogin } from '../services/api.ts'; // Renamed to avoid conflict

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const navigate = useNavigate();

  // This effect synchronizes the state with localStorage when it changes.
  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }, [token]);

  const login = async (hospitalId, privateKey) => {
    // The try/catch block is in LoginPage.jsx, which will handle UI updates on error.
    // This function will throw an error if the API call fails, to be caught by the form.
    const response = await apiLogin({ hospitalId, privateKey });

    if (response && response.token) {
      setToken(response.token);
      toast.success(`Connecté en tant que ${hospitalId}`);
      navigate('/dashboard');
    } else {
      // This case might not be hit if apiLogin throws, but it's a safeguard.
      throw new Error("La connexion a échoué : token non reçu.");
    }
  };

  const logout = () => {
    setToken(null);
    toast('Déconnecté avec succès.', { icon: '👋' });
    navigate('/'); // Redirect to login page
  };

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    isLoggedIn: !!token,
    token,
    login,
    logout,
  }), [token]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
