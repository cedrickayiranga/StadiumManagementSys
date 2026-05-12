import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, ...userData } = response.data;
      login(userData, token);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Logo Section */}
        <div className="mb-10 text-center">
          <h1 className="font-['Bebas_Neue'] text-[#D4AF37] text-6xl tracking-[4px] leading-none">AMAHORO</h1>
          <p className="text-[9px] uppercase tracking-[4px] text-[#888] mt-2">STADIUM MANAGEMENT SYSTEM</p>
        </div>

        {/* Form Card */}
        <div className="w-full bg-[#111] border border-[#222] p-8">
          {error && (
            <div className="mb-6 p-3 bg-[rgba(200,16,46,0.1)] border border-[rgba(200,16,46,0.3)] text-[#C8102E] text-[11px] uppercase tracking-[1px] text-center">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[2px] text-[#666]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[#222] px-4 py-3 text-[#eee] text-sm focus:border-[#D4AF37] outline-none transition-colors"
                placeholder="email@example.com"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[2px] text-[#666]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0d0d0d] border border-[#222] px-4 py-3 text-[#eee] text-sm focus:border-[#D4AF37] outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#C8102E] text-white py-4 font-['Bebas_Neue'] text-xl tracking-[3px] hover:bg-[#a00d25] transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="border-2 border-t-transparent border-white rounded-full w-5 h-5 animate-spin"></div>
              ) : (
                'SIGN IN'
              )}
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-8 text-[11px] tracking-[1px]">
          <span className="text-[#666]">Don't have an account? </span>
          <Link to="/register" className="text-[#D4AF37] hover:underline uppercase font-bold ml-1">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
