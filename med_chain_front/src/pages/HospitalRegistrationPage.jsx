import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerHospital } from '../services/hederaService.js';
import { useAuth } from '../contexts/AuthContext.jsx';

const HospitalRegistrationPage = () => {
  const navigate = useNavigate();
  const { hospitalId } = useAuth();
  
  const [formData, setFormData] = useState({
    hospitalName: '',
    operatorAccountId: '',
    operatorPrivateKey: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };
  
  const validateForm = () => {
    if (!formData.hospitalName.trim()) {
      setError('Le nom de l\'hôpital est requis.');
      return false;
    }
    
    if (!formData.operatorAccountId.trim()) {
      setError('L\'ID du compte opérateur est requis.');
      return false;
    }
    
    if (!formData.operatorPrivateKey.trim()) {
      setError('La clé privée de l\'opérateur est requise.');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await registerHospital(
        formData.hospitalName,
        formData.operatorAccountId,
        formData.operatorPrivateKey
      );
      
      if (response.success) {
        setResult(response.hospital);
      } else {
        setError(response.error || 'Erreur lors de l\'enregistrement de l\'hôpital.');
      }
    } catch (err) {
      setError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setFormData({
      hospitalName: '',
      operatorAccountId: '',
      operatorPrivateKey: ''
    });
    setResult(null);
    setError(null);
  };
  
  return (
    <div className="container mx-auto max-w-2xl py-10">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Enregistrement de l'Hôpital sur Hedera</h1>
        
        {result ? (
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              <h2 className="text-xl font-bold mb-2">✅ Enregistrement Réussi !</h2>
              <p className="mb-4">Votre hôpital a été enregistré avec succès sur la blockchain Hedera.</p>
              
              <div className="text-left bg-white p-4 rounded mb-4">
                <h3 className="font-bold text-lg mb-2">Informations de l'Hôpital :</h3>
                <p><span className="font-semibold">Nom :</span> {result.name}</p>
                <p><span className="font-semibold">ID du Compte :</span> {result.id}</p>
                <p><span className="font-semibold">Clé Privée :</span> <span className="font-mono text-sm">{result.privateKey}</span></p>
                <p><span className="font-semibold">Clé Publique :</span> <span className="font-mono text-sm">{result.publicKey}</span></p>
                <p><span className="font-semibold">Date de Création :</span> {new Date(result.createdAt).toLocaleString()}</p>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                ⚠️ <strong>Important :</strong> Conservez précieusement ces informations. La clé privée est requise pour effectuer des transactions.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <button 
                  onClick={handleReset}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Enregistrer un autre hôpital
                </button>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Retour au Tableau de Bord
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="hospitalName">
                Nom de l'Hôpital *
              </label>
              <input
                type="text"
                id="hospitalName"
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Hôpital Central"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="operatorAccountId">
                ID du Compte Opérateur *
              </label>
              <input
                type="text"
                id="operatorAccountId"
                name="operatorAccountId"
                value={formData.operatorAccountId}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-mono"
                placeholder="0.0.12345"
              />
              <p className="text-gray-600 text-xs mt-1">
                L'ID du compte qui possède les fonds pour créer le nouveau compte (ex: 0.0.12345)
              </p>
            </div>
            
            <div>
              <label className="block text-gray-700 font-bold mb-2" htmlFor="operatorPrivateKey">
                Clé Privée de l'Opérateur *
              </label>
              <input
                type="password"
                id="operatorPrivateKey"
                name="operatorPrivateKey"
                value={formData.operatorPrivateKey}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline font-mono"
                placeholder="302e020100300506032b657004220420..."
              />
              <p className="text-gray-600 text-xs mt-1">
                La clé privée associée au compte opérateur (utilisée pour signer les transactions)
              </p>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enregistrement...
                  </>
                ) : (
                  'Enregistrer l\'Hôpital'
                )}
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">ℹ️ Informations sur l'Enregistrement</h3>
          <p className="text-blue-700 text-sm">
            Cette page vous permet d'enregistrer votre hôpital sur la blockchain Hedera. 
            Un nouveau compte sera créé pour votre hôpital avec un solde initial de 10 HBAR.
            Vous recevrez les identifiants de ce compte que vous pourrez utiliser pour 
            interagir avec la blockchain.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HospitalRegistrationPage;