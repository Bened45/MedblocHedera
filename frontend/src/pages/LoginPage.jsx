import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import toast from 'react-hot-toast';

function LoginPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ hospitalId: '', privateKey: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.hospitalId) newErrors.hospitalId = 'L\'identifiant de l\'hôpital est requis.';
    if (!formData.privateKey) newErrors.privateKey = 'La clé privée est requise.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Veuillez remplir tous les champs requis.');
      return;
    }

    setLoading(true);
    try {
      await login(formData.hospitalId, formData.privateKey);
    } catch (error) {
      console.error("Login failed:", error);
      toast.error('La connexion a échoué. Veuillez vérifier vos identifiants.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex justify-center items-center h-screen">
      <div className="w-full max-w-sm">
        <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" noValidate>
          <h1 className="text-center text-xl md:text-2xl font-bold mb-6">Connexion</h1>
          <fieldset disabled={loading}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hospitalId">
                Identifiant Hôpital
              </label>
              <input 
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.hospitalId ? 'border-red-500' : ''}`}
                id="hospitalId" 
                name="hospitalId"
                type="text" 
                placeholder="ID Hôpital"
                value={formData.hospitalId}
                onChange={handleChange}
              />
              {errors.hospitalId && <p className="text-red-500 text-xs italic mt-2">{errors.hospitalId}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="privateKey">
                Clé Privée
              </label>
              <input 
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${errors.privateKey ? 'border-red-500' : ''}`}
                id="privateKey" 
                name="privateKey"
                type="password" 
                placeholder="******************"
                value={formData.privateKey}
                onChange={handleChange}
              />
              {errors.privateKey && <p className="text-red-500 text-xs italic mt-2">{errors.privateKey}</p>}
            </div>
            <div className="flex items-center justify-between">
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Se Connecter'}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;