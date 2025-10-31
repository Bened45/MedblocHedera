
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

const Layout = ({ children }) => {
  const { isLoggedIn, logout } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-2">
            <Link to="/dashboard" className="flex items-center">
              <img src="/logo.svg" alt="MedChain Logo" className="h-16 w-16 mr-2" />
            </Link>
            <div className="flex items-center">
              <Link to="/scan" className="text-gray-600 hover:text-blue-700 ml-4">Scanner QR</Link>
              <Link to="/hospital-registration" className="text-gray-600 hover:text-blue-700 ml-4">Enregistrement</Link>
              {isLoggedIn && (
                <button onClick={logout} className="ml-4 bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded text-sm">
                  Déconnexion
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="p-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
