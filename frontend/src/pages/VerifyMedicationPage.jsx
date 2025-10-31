import React, { useState } from 'react';
import { verifyMedication } from '../services/medicationService.js';
import { verifyVc } from '../services/api.ts';
import toast from 'react-hot-toast';

const VerifyMedicationPage = () => {
  const [qrContent, setQrContent] = useState('');
  const [medication, setMedication] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setQrContent(event.target.value);
  };

  const handleSubmit = async () => {
    if (!qrContent) {
      setErrorMessage('Veuillez entrer le contenu du QR code.');
      return;
    }
    setErrorMessage('');
    setMedication(null);
    setLoading(true);

    try {
      const verificationResult = await verifyVc({ vc: qrContent });

      if (verificationResult.isValid) {
        const medData = await verifyMedication(qrContent);
        setMedication(medData);
        toast.success('Médicament authentifié avec succès !');
      } else {
        setErrorMessage('Le Verifiable Credential n\'est pas valide.');
        toast.error('Le Verifiable Credential n\'est pas valide.');
      }
    } catch (verificationError) {
      setErrorMessage(String(verificationError));
      toast.error(String(verificationError));
    }
    setLoading(false);
  };

  const handleReset = () => {
    setQrContent('');
    setMedication(null);
    setErrorMessage('');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Vérifier un Médicament</h1>
      
      <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
        {!loading && !medication ? (
          <div className="text-center">
            <p className="text-gray-600 mb-6">
              Entrez ou collez le QR code sur la boîte du médicament pour vérifier son authenticité et sa traçabilité.
            </p>
            <textarea
              value={qrContent}
              onChange={handleInputChange}
              placeholder="Contenu du QR code du médicament"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 h-32"
            />
            <button 
              onClick={handleSubmit}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition duration-300 w-full"
            >
              Vérifier le Médicament
            </button>
          </div>
        ) : null}

        {loading && (
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">Vérification en cours...</p>
            {/* ... spinner ... */}
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg text-center">
            <p className="font-bold">Erreur de Vérification</p>
            <p>{errorMessage}</p>
            <button onClick={handleReset} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Réessayer</button>
          </div>
        )}

        {medication && (
          <div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Médicament Authentique</h2>
            {/* ... medication details ... */}
            <div className="text-center mt-8">
                <button onClick={handleReset} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">Vérifier un autre médicament</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyMedicationPage;