import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

const ScanQrPage = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const startScan = async () => {
    setErrorMessage('');
    setScanResult(null);

    try {
      await BarcodeScanner.checkPermission({ force: true });
      BarcodeScanner.hideBackground();
      document.body.classList.add('scanner-active');
      setIsScanning(true);

      const result = await BarcodeScanner.startScan();

      setIsScanning(false);
      document.body.classList.remove('scanner-active');
      await BarcodeScanner.showBackground();

      if (result.hasContent) {
        setLoading(true);
        setScanResult(result.content);
        setTimeout(() => {
          navigate(`/patient-data/${result.content}`);
        }, 800);
      } else {
        // This case might not be reachable if stopScan is used
        setErrorMessage('Aucun QR code détecté.');
      }
    } catch (error) {
      setIsScanning(false);
      document.body.classList.remove('scanner-active');
      await BarcodeScanner.showBackground();
      if (error.message.includes('cancelled')) {
        console.log('Scan cancelled by user.');
      } else {
        console.error('Barcode Scanner Error:', error);
        setErrorMessage(`Erreur du scanner: ${error.message}`);
      }
    }
  };

  const stopScan = async () => {
    await BarcodeScanner.stopScan();
  };

  useEffect(() => {
    return () => {
      BarcodeScanner.stopScan();
      BarcodeScanner.showBackground();
      document.body.classList.remove('scanner-active');
    };
  }, []);

  return (
    <>
      {isScanning && (
        <div className="fixed inset-x-0 bottom-0 z-50 p-4 text-center">
          <button 
            onClick={stopScan}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg"
          >
            Annuler
          </button>
        </div>
      )}
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Scanner un QR Code Patient</h1>
        
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          {loading ? (
            <div>
              <p className="text-lg font-semibold text-gray-700">QR Code scanné !</p>
              <p className="text-gray-600 mb-4">Chargement du dossier patient...</p>
              <div className="flex justify-center">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="font-mono break-all text-sm text-gray-500 mt-4">{scanResult}</p>
            </div>
          ) : (
            <>
              {!isScanning && (
                <>
                  <p className="text-gray-600 mb-6">
                    Cliquez sur le bouton ci-dessous pour ouvrir la caméra de votre appareil et scanner le QR code du patient.
                  </p>
                  <button 
                    onClick={startScan}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition duration-300 w-full"
                  >
                    Démarrer le Scan
                  </button>
                </>
              )}
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
    </>
  );
};

export default ScanQrPage;
