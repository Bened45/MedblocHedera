
import React, { useState, useEffect } from 'react';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { verifyMedication } from '../services/medicationService.js';
import { verifyVc } from '../services/api.ts'; // Import verifyVc
import toast from 'react-hot-toast';

const VerifyMedicationPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [medication, setMedication] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const startScan = async () => {
    setErrorMessage('');
    setMedication(null);
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
        try {
          // Assuming result.content is the Verifiable Credential (VC)
          const verificationResult = await verifyVc({ vc: result.content });

          if (verificationResult.isValid) {
            // If the VC is valid, then resolve the DID within the VC to get medication data
            // This part might need adjustment based on the actual structure of your VC
            // For now, let's assume the VC directly contains the medication data or a DID for it
            const medData = await verifyMedication(result.content); // Still use verifyMedication for now, assuming it extracts DID from VC
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
      }
    } catch (error) {
      setIsScanning(false);
      document.body.classList.remove('scanner-active');
      await BarcodeScanner.showBackground();
      if (error.message.includes('cancelled')) {
        // User cancelled the scan, do nothing
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
      // Ensure the scanner is stopped on component unmount
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
            Annuler le Scan
          </button>
        </div>
      )}
      <div className="container mx-auto p-4">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center">Vérifier un Médicament</h1>
        
        <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
          {!loading && !medication && !isScanning && (
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Scannez le QR code sur la boîte du médicament pour vérifier son authenticité et sa traçabilité.
              </p>
              <button 
                onClick={startScan}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-4 px-8 rounded-lg text-xl shadow-lg transition duration-300 w-full"
              >
                Démarrer le Scan de Médicament
              </button>
            </div>
          )}

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
              <button onClick={startScan} className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">Réessayer</button>
            </div>
          )}

          {medication && (
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">✅ Médicament Authentique</h2>
              {/* ... medication details ... */}
              <div className="text-center mt-8">
                  <button onClick={startScan} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg">Scanner un autre médicament</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VerifyMedicationPage;
