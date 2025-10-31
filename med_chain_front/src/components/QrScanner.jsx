import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const QrScanner = ({ onScanSuccess }) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scannerRef.current) {
      return;
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(
      scannerRef.current.id,
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    const handleScan = (decodedText, decodedResult) => {
      onScanSuccess(decodedText, decodedResult);
      html5QrcodeScanner.clear();
    };

    const handleError = (error) => {
      console.error('QR Code scan error:', error);
    };

    html5QrcodeScanner.render(handleScan, handleError);

    return () => {
      html5QrcodeScanner.clear();
    };
  }, [onScanSuccess]);

  return <div id="qr-scanner" ref={scannerRef} />;
};

export default QrScanner;
