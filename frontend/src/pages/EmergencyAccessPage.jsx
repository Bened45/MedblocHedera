import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { requestEmergencyAccess } from '../services/patientService.js';

function EmergencyAccessPage() {
  const [npi, setNpi] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!npi) newErrors.npi = 'Le NPI du patient est requis.';
    return newErrors;
  };

  const handleAccessRequest = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const message = await requestEmergencyAccess(npi);
      toast.success(message);
    } catch (error) {
      toast.error(String(error));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNpi(e.target.value);
    if (errors.npi) {
      setErrors(prev => ({ ...prev, npi: null }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="w-full max-w-md mx-auto mt-10">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p className="font-bold">Protocole d'Accès d'Urgence</p>
          <p>Cet accès est réservé aux situations critiques et sera tracé.</p>
        </div>
        <form onSubmit={handleAccessRequest} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" noValidate>
          <fieldset disabled={loading}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="npi">
                NPI du Patient Inconscient
              </label>
              <input 
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.npi ? 'border-red-500' : ''}`}
                id="npi" 
                type="text" 
                placeholder="Entrez le NPI du patient"
                value={npi}
                onChange={handleChange}
              />
              {errors.npi && <p className="text-red-500 text-xs italic mt-2">{errors.npi}</p>}
            </div>
            <div className="flex items-center justify-between">
              <button 
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Débloquer les Données Vitales'}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
}

export default EmergencyAccessPage;
