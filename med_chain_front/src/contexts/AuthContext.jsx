import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hospitalId, setHospitalId] = useState(null);
  const navigate = useNavigate();

  // Check for persisted login state on app load
  useEffect(() => {
    const storedHospitalId = localStorage.getItem('hospitalId');
    if (storedHospitalId) {
      setIsLoggedIn(true);
      setHospitalId(storedHospitalId);

    }
  }, []);

  const login = (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsLoggedIn(true);
        setHospitalId(id);
        localStorage.setItem('hospitalId', id); // Persist login
        toast.success(`Connecté en tant que ${id}`);
        navigate('/dashboard');
        resolve();
      }, 1000); // Simulate 1 second network delay
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setHospitalId(null);
    localStorage.removeItem('hospitalId'); // Clear persisted login
    toast('Déconnecté avec succès.', { icon: '👋' });
    navigate('/'); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, hospitalId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};