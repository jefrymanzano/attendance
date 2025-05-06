import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import QRCodeLogin from '../components/QRCodeLogin';
import { User, Lock, QrCode } from 'lucide-react';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<'email' | 'qrcode'>('email');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('http://localhost/boltes5/project/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.status === 'success') {
        setUser({
          id: data.user.id,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          email: data.user.email,
          role: data.user.role
        });
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to connect to the server');
      console.error('Login error:', err);
    }
  };

  const handleQRLogin = async (employeeId: number) => {
    try {
      const response = await fetch(`http://localhost/boltes5/project/api/login.php?employee_id=${employeeId}`);
      const data = await response.json();
      
      if (data.status === 'success') {
        setUser({
          id: data.user.id,
          firstName: data.user.first_name,
          lastName: data.user.last_name,
          email: data.user.email,
          role: data.user.role
        });
        setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to connect to the server');
      console.error('QR Login error:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 to-white-800">
      <div className="m-auto w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">AttendEase</h1>
          <p className="text-gray-600 mt-2">Employee Attendance System</p>
        </div>

        <div className="flex mb-6">
          <button
            onClick={() => setLoginMethod('email')}
            className={`flex-1 py-2 flex justify-center items-center gap-2 transition-all ${
              loginMethod === 'email' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-l-md`}
          >
            <User size={18} />
            <span>Email</span>
          </button>
          <button
            onClick={() => setLoginMethod('qrcode')}
            className={`flex-1 py-2 flex justify-center items-center gap-2 transition-all ${
              loginMethod === 'qrcode' 
                ? 'bg-gray-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-r-md`}
          >
            <QrCode size={18} />
            <span>QR Code</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        {loginMethod === 'email' ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full py-2 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
            >
              Sign In
            </button>
          </form>
        ) : (
          <QRCodeLogin onSuccess={handleQRLogin} mode="login" />
        )}
      </div>
    </div>
  );
};

export default Login;