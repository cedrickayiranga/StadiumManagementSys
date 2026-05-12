import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { name, email, password, confirmPassword, role } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await api.post('/api/auth/register', { name, email, password, role });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Try again.');
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
          {success && (
            <div className="mb-6 p-3 bg-[rgba(0,154,68,0.1)] border border-[rgba(0,154,68,0.3)] text-[#009A44] text-[11px] uppercase tracking-[1px] text-center">
              {success}
            </div>
          )}

          <div className="space-y-4">
            {/* Full Name Field */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[2px] text-[#666]">Full Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-[#0d0d0d] border border-[#222] px-4 py-2.5 text-[#eee] text-sm focus:border-[#D4AF37] outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[2px] text-[#666]">Email Address</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#0d0d0d] border border-[#222] px-4 py-2.5 text-[#eee] text-sm focus:border-[#D4AF37] outline-none transition-colors"
                placeholder="email@example.com"
              />
            </div>

            {/* Role Selector */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[2px] text-[#666]">Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-[#0d0d0d] border border-[#222] px-4 py-2.5 text-[#eee] text-sm focus:border-[#D4AF37] outline-none transition-colors appearance-none"
              >
                <option value="CUSTOMER">CUSTOMER</option>
                <option value="STAFF">STAFF</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[2px] text-[#666]">Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#0d0d0d] border border-[#222] px-4 py-2.5 text-[#eee] text-sm focus:border-[#D4AF37] outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-[9px] uppercase tracking-[2px] text-[#666]">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-[#0d0d0d] border border-[#222] px-4 py-2.5 text-[#eee] text-sm focus:border-[#D4AF37] outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>

            {/* Create Account Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#C8102E] text-white py-3.5 mt-4 font-['Bebas_Neue'] text-xl tracking-[3px] hover:bg-[#a00d25] transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="border-2 border-t-transparent border-white rounded-full w-5 h-5 animate-spin"></div>
              ) : (
                'CREATE ACCOUNT'
              )}
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-[11px] tracking-[1px]">
          <span className="text-[#666]">Already have an account? </span>
          <Link to="/login" className="text-[#D4AF37] hover:underline uppercase font-bold ml-1">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
