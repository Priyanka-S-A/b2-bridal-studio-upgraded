import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../animations/variants';

const API = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
  const token = new URLSearchParams(window.location.search).get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/api/customer/reset-password`, { token, newPassword });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Reset failed. The link may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  const PasswordToggle = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2"
      style={{ color: 'rgba(255,195,0,0.4)' }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        {show ? <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>}
      </svg>
    </button>
  );

  return (
    <div className="min-h-screen flex items-center justify-center relative" style={{ background: '#000' }}>
      {/* Background glow */}
      <div className="absolute pointer-events-none" style={{ top: '30%', left: '50%', transform: 'translate(-50%, -50%)', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,195,0,0.06), transparent 65%)' }} />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md mx-4"
      >
        {/* Logo */}
        <motion.div variants={fadeUp} className="text-center mb-8">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ border: '1px solid rgba(255,195,0,0.4)', boxShadow: '0 0 20px rgba(255,195,0,0.15)' }}>
            <span className="font-cinzel text-lg font-bold text-gold-gradient">B2</span>
          </div>
          <h1 className="font-cinzel text-base tracking-[0.3em] uppercase" style={{ color: '#F8F5F0' }}>Reset Password</h1>
          <p className="font-cormorant italic text-sm mt-1" style={{ color: 'rgba(248,245,240,0.6)' }}>Create a new password for your account</p>
        </motion.div>

        {/* Form / Success / No Token */}
        <motion.div
          variants={fadeUp}
          className="glass-dark p-8 rounded-sm"
          style={{ border: '1px solid rgba(255,195,0,0.15)' }}
        >
          {!token ? (
            /* No token in URL */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ border: '2px solid rgba(255,80,80,0.4)', boxShadow: '0 0 30px rgba(255,80,80,0.1)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
              <h2 className="font-cinzel text-sm tracking-[0.2em] uppercase mb-2" style={{ color: '#ff6b6b' }}>Invalid Reset Link</h2>
              <p className="font-cormorant italic text-sm" style={{ color: 'rgba(248,245,240,0.6)' }}>This link is missing a reset token. Please request a new one.</p>
            </div>
          ) : success ? (
            /* Success state */
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ border: '2px solid rgba(255,195,0,0.4)', boxShadow: '0 0 30px rgba(255,195,0,0.15)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="font-cinzel text-sm tracking-[0.2em] uppercase mb-2" style={{ color: '#FFD700' }}>Password Reset Successful!</h2>
              <p className="font-cormorant italic text-sm mb-4" style={{ color: 'rgba(248,245,240,0.6)' }}>You can now sign in with your new password.</p>
              <Link to="/login" className="btn-gold inline-flex justify-center px-8">
                Go to Login
              </Link>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block font-cinzel text-[0.6rem] tracking-[0.2em] uppercase mb-2 font-semibold" style={{ color: 'rgba(255,195,0,0.75)' }}>New Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="input-luxury rounded-sm pr-12"
                    />
                    <PasswordToggle show={showPw} onToggle={() => setShowPw(!showPw)} />
                  </div>
                </div>
                <div>
                  <label className="block font-cinzel text-[0.6rem] tracking-[0.2em] uppercase mb-2 font-semibold" style={{ color: 'rgba(255,195,0,0.75)' }}>Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="input-luxury rounded-sm pr-12"
                    />
                    <PasswordToggle show={showConfirmPw} onToggle={() => setShowConfirmPw(!showConfirmPw)} />
                  </div>
                </div>

                {error && (
                  <p className="font-cormorant italic text-xs text-center" style={{ color: '#ff6b6b' }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full justify-center mt-2"
                  style={{ opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
        </motion.div>

        <motion.p variants={fadeUp} className="text-center mt-6 font-cormorant text-sm" style={{ color: 'rgba(248,245,240,0.6)' }}>
          Back to{' '}
          <Link to="/login" className="font-cinzel text-[0.65rem] tracking-[0.1em] uppercase" style={{ color: '#FFD700' }}>Login</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
