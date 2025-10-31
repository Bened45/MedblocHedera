import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { enrollPatient } from '../services/patientService.js';

function EnrollPatientPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    npi: '',
    name: '',
    dob: '',
    allergies: '',
    bloodGroup: '',
    emergencyContact: '',
    weight: '',
    height: '',
    firstEntry: ''
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.npi) newErrors.npi = 'Le NPI est requis.';
    if (!formData.name) newErrors.name = 'Le nom complet est requis.';
    if (!formData.dob) newErrors.dob = 'La date de naissance est requise.';
    if (!formData.firstEntry) newErrors.firstEntry = 'Une première entrée médicale est requise.';
    // Add more specific validation rules here, e.g., for NPI format
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
    // Clear the error for the field being edited
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Veuillez corriger les erreurs dans le formulaire.');
      return;
    }

    setLoading(true);
    try {
      toast.loading('Enrôlement du patient en cours...');
      const generatedId = await enrollPatient(formData);
      toast.dismiss();
      toast.success('Patient enrôlé avec succès !');
      navigate(`/patient-data/${generatedId}`);
    } catch (error) {
      toast.dismiss();
      toast.error("Une erreur est survenue lors de l'enrôlement.");
      console.error("Enrollment failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-lg py-10">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Enrôler un Nouveau Patient</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md" noValidate>
        <fieldset disabled={loading}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="npi">
              NPI (Numéro Personnel d’Identification)
            </label>
            <input 
              type="text" 
              name="npi"
              id="npi"
              value={formData.npi}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.npi ? 'border-red-500' : ''}`}
            />
            {errors.npi && <p className="text-red-500 text-xs italic mt-2">{errors.npi}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
              Nom Complet
            </label>
            <input 
              type="text" 
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <p className="text-red-500 text-xs italic mt-2">{errors.name}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="dob">
              Date de Naissance
            </label>
            <input 
              type="date" 
              name="dob"
              id="dob"
              value={formData.dob}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.dob ? 'border-red-500' : ''}`}
            />
            {errors.dob && <p className="text-red-500 text-xs italic mt-2">{errors.dob}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="allergies">
              Allergies (séparées par des virgules)
            </label>
            <input 
              type="text" 
              name="allergies"
              id="allergies"
              value={formData.allergies}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="bloodGroup">
              Groupe Sanguin
            </label>
            <select 
              name="bloodGroup"
              id="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Sélectionner</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="emergencyContact">
              Contact d'Urgence (Nom et Téléphone)
            </label>
            <input 
              type="text" 
              name="emergencyContact"
              id="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="weight">
              Poids (kg)
            </label>
            <input 
              type="number" 
              name="weight"
              id="weight"
              value={formData.weight}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="height">
              Taille (cm)
            </label>
            <input 
              type="number" 
              name="height"
              id="height"
              value={formData.height}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="firstEntry">
              Première Entrée Médicale (ex: Création du dossier)
            </label>
            <textarea 
              name="firstEntry"
              id="firstEntry"
              rows="4"
              value={formData.firstEntry}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.firstEntry ? 'border-red-500' : ''}`}
            ></textarea>
            {errors.firstEntry && <p className="text-red-500 text-xs italic mt-2">{errors.firstEntry}</p>}
          </div>
          <div className="text-center">
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg transition duration-300 w-full flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'Enrôler et Générer le QR Code'}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}

export default EnrollPatientPage;