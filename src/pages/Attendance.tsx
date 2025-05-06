import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';
import QRCodeLogin from '../components/QRCodeLogin';
import { Clock, CheckCircle } from 'lucide-react';

const Attendance: React.FC = () => {
  const { user } = useUser();
  const [attendanceStatus, setAttendanceStatus] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const handleTimeRecord = (employeeId: number) => {
    // In a real app, this would make an API call to record attendance
    const currentTime = new Date().toLocaleTimeString();
    setAttendanceStatus(`Time recorded successfully at ${currentTime}`);
    setShowScanner(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Attendance</h1>
        <p className="text-gray-600">Record your attendance using QR code</p>
      </div>

      {attendanceStatus && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
          <CheckCircle className="mr-2" size={20} />
          {attendanceStatus}
        </div>
      )}

      {!showScanner ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Clock className="text-indigo-600 mr-2" size={24} />
              <h2 className="text-lg font-semibold">Time In</h2>
            </div>
            <p className="text-gray-600 mb-4">Record your arrival time for today</p>
            <button
              onClick={() => setShowScanner(true)}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Scan QR Code
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <Clock className="text-indigo-600 mr-2" size={24} />
              <h2 className="text-lg font-semibold">Time Out</h2>
            </div>
            <p className="text-gray-600 mb-4">Record your departure time for today</p>
            <button
              onClick={() => setShowScanner(true)}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Scan QR Code
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <QRCodeLogin onSuccess={handleTimeRecord} mode="timeIn" />
          <button
            onClick={() => setShowScanner(false)}
            className="mt-4 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default Attendance;