import React, { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRCodeLoginProps {
  onSuccess: (employeeId: number) => void;
  mode: 'login' | 'timeIn';
}

const QRCodeLogin: React.FC<QRCodeLoginProps> = ({ onSuccess, mode }) => {
  const [scanning, setScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);

  useEffect(() => {
    let mounted = true;

    const startScanner = async () => {
      try {
        const qrCode = new Html5Qrcode("qr-reader");
        if (mounted) {
          setHtml5QrCode(qrCode);
          setScanning(true);
        }
        
        await qrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            try {
              const qrData = JSON.parse(decodedText);
              if (qrData && qrData.employeeId) {
                handleSuccess(qrData.employeeId);
              } else {
                setErrorMessage("Invalid QR code format");
              }
            } catch (error) {
              setErrorMessage("Could not parse QR code data");
            }
          },
          (errorMessage) => {
            console.log(errorMessage);
          }
        );
      } catch (err) {
        if (mounted) {
          setErrorMessage("Could not access camera. Please ensure camera permissions are granted.");
          console.error(err);
        }
      }
    };

    const handleSuccess = async (employeeId: number) => {
      if (html5QrCode && html5QrCode.isScanning) {
        try {
          await html5QrCode.stop();
          if (mounted) {
            setScanning(false);
            onSuccess(employeeId);
          }
        } catch (err) {
          console.error("Failed to stop QR scanner", err);
        }
      }
    };

    startScanner();

    return () => {
      mounted = false;
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(err => {
          console.error("Failed to stop QR scanner", err);
        });
      }
    };
  }, [onSuccess]);

  return (
    <div className="flex flex-col items-center">
      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md w-full">
          {errorMessage}
        </div>
      )}
      
      <div id="qr-reader" className="w-full max-w-xs border rounded-lg overflow-hidden"></div>
      
      <div className="mt-4 text-center">
        {scanning ? (
          <p className="text-gray-600">
            Please scan your QR code to {mode === 'login' ? 'log in' : 'record attendance'}...
          </p>
        ) : (
          <p className="text-gray-600">Starting camera...</p>
        )}
      </div>
      
      {/* For demo purposes only */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={() => onSuccess(1)}
          className="bg-indigo-100 text-gray-800 text-sm py-2 px-4 rounded hover:bg-indigo-200 transition-colors"
        >
          Simulate Admin {mode === 'login' ? 'Login' : 'Time-In'}
        </button>
        <button
          onClick={() => onSuccess(2)}
          className="bg-indigo-100 text-gray-800 text-sm py-2 px-4 rounded hover:bg-indigo-200 transition-colors"
        >
          Simulate User {mode === 'login' ? 'Login' : 'Time-In'}
        </button>
      </div>
    </div>
  );
};

export default QRCodeLogin;