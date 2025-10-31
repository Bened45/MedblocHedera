import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScanQrPage = () => {
  const navigate = useNavigate();
  const [qrContent, setQrContent] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event) => {
    setQrContent(event.target.value);
  };

  const handleSubmit = () => {
    if (!qrContent) {
      setErrorMessage('Veuillez entrer le contenu du QR code.');
      return;
    }
    setErrorMessage('');
    setLoading(true);
    // Simulate a small delay like the original code
    setTimeout(() => {
      navigate(`/patient-data/${qrContent}`);
    }, 800);
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Entrer le QR Code Patient</h1>
      
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        {loading ? (
          <div>
            <p className="text-lg font-semibold text-gray-700">Données envoyées !</p>
            <p className="text-gray-600 mb-4">Chargement du dossier patient...</p>
            <div className="flex justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="font-mono break-all text-sm text-gray-500 mt-4">{qrContent}</p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-6">
              Entrez ou collez le contenu du QR code du patient dans le champ ci-dessous.
            </p>
            <input
              type="text"
              value={qrContent}
              onChange={handleInputChange}
              placeholder="Contenu du QR code"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
            />
            <button 
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition duration-300 w-full"
            >
              Valider
            </button>хода
          </>
        )}

        {errorMessage && !loading && (
          <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg">
            <p className="font-bold">Erreur</p>
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScanQrPage;