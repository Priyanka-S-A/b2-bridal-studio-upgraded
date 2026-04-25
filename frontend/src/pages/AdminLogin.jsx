import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      // ✅ FIXED PART (IMPORTANT)
      localStorage.setItem('adminToken', res.data.token);

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: username,
          role: res.data.role
        })
      );

      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img src="/b2-logo.png" alt="B2 Bridal Studio" style={{ width: 72, height: 72, objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.15))' }} />
          <h2 className="mt-4 text-2xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: 'Cinzel, serif' }}>
            Admin Portal
          </h2>
          <p className="mt-1 text-sm font-medium" style={{ color: '#555' }}>
            Sign in to manage services and bookings
          </p>
        </div>

        <div className="admin-login-card">
          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-sm mb-5 text-center font-medium">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="admin-input pl-10"
                  placeholder="Enter admin username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input pl-10"
                  placeholder="Enter admin password"
                />
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={loading}
                className="admin-btn-primary w-full justify-center py-3 text-base"
                style={{ borderRadius: 8 }}
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;