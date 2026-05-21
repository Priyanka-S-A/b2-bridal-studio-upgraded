import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../animations/variants';

const API = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/api/customer/forgot-password`, { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="font-cinzel text-base tracking-[0.3em] uppercase" style={{ color: '#F8F5F0' }}>Forgot Password</h1>
          <p className="font-cormorant italic text-sm mt-1" style={{ color: 'rgba(248,245,240,0.6)' }}>Enter your email and we'll send you a reset link</p>
        </motion.div>

        {/* Form / Success */}
        <motion.div
          variants={fadeUp}
          className="glass-dark p-8 rounded-sm"
          style={{ border: '1px solid rgba(255,195,0,0.15)' }}
        >
          {success ? (
            <div className="text-center py-4">
              {/* Checkmark icon */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ border: '2px solid rgba(255,195,0,0.4)', boxShadow: '0 0 30px rgba(255,195,0,0.15)' }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="font-cinzel text-sm tracking-[0.2em] uppercase mb-2" style={{ color: '#FFD700' }}>Reset Link Sent!</h2>
              <p className="font-cormorant italic text-sm" style={{ color: 'rgba(248,245,240,0.6)' }}>Check your email inbox.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-5">
                <div>
                  <label className="block font-cinzel text-[0.6rem] tracking-[0.2em] uppercase mb-2 font-semibold" style={{ color: 'rgba(255,195,0,0.75)' }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="input-luxury rounded-sm"
                  />
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
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          )}
        </motion.div>

        <motion.p variants={fadeUp} className="text-center mt-6 font-cormorant text-sm" style={{ color: 'rgba(248,245,240,0.6)' }}>
          Remember your password?{' '}
          <Link to="/login" className="font-cinzel text-[0.65rem] tracking-[0.1em] uppercase" style={{ color: '#FFD700' }}>Login</Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
