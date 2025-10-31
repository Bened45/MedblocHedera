import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { findPatientByNpi } from '../services/patientService.js';

function PatientAccessPage() {
  const navigate = useNavigate();
  const [npi, setNpi] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!npi) newErrors.npi = 'Le NPI du patient est requis.';
    return newErrors;
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const patientId = await findPatientByNpi(npi);
      toast.success('Patient trouvé !');
      navigate(`/patient-data/${patientId}`);
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
      <h1 className="text-2xl font-bold mb-4">Accès aux Données Patient</h1>
      <div className="w-full max-w-md">
        <form onSubmit={handleSearch} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" noValidate>
          <fieldset disabled={loading}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="npi">
                NPI (Numéro Personnel d’Identification)
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
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex justify-center items-center"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Rechercher'}
              </button>
            </div>
          </fieldset>
        </form>
        <div className="text-center my-4">OU</div>
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 text-center">
            <p className="text-gray-700 mb-4">Scannez le QR code du patient</p>
            <button 
              onClick={() => navigate('/scan')}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
              type="button"
            >
              Ouvrir le Scanner
            </button>
        </div>
      </div>
    </div>
  );
}

export default PatientAccessPage;
