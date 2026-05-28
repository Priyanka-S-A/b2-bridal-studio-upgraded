import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag, Plus, Trash2, Power, PowerOff } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', discountPercentage: '' });
  const [error, setError] = useState('');

  const fetchCoupons = async () => {
    try {
      const res = await axios.get(`${API}/api/coupons`);
      setCoupons(res.data);
    } catch (err) {
      console.error('Failed to fetch coupons', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.code || !form.discountPercentage) return;
    
    try {
      await axios.post(`${API}/api/coupons`, form);
      setForm({ code: '', discountPercentage: '' });
      fetchCoupons();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create coupon');
    }
  };

  const handleToggle = async (id) => {
    try {
      await axios.patch(`${API}/api/coupons/${id}/toggle`);
      fetchCoupons();
    } catch (err) {
      alert('Failed to toggle status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon permanently?')) return;
    try {
      await axios.delete(`${API}/api/coupons/${id}`);
      fetchCoupons();
    } catch (err) {
      alert('Failed to delete coupon');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="bg-[#FDFDFD] min-h-screen p-4 md:p-8 font-sans text-gray-900">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-cinzel uppercase tracking-wide text-gray-900 flex items-center gap-3">
          <Tag size={24} className="text-[#D4AF37]" />
          Coupon Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">Create and manage discount coupons.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 p-6">
            <h3 className="text-sm font-cinzel font-bold uppercase tracking-wide mb-4 pb-3 text-gray-700" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>Create Coupon</h3>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-cinzel font-semibold uppercase tracking-wide text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 font-cormorant text-lg text-gray-800 transition-colors uppercase"
                  placeholder="e.g. SUMMER15"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-cinzel font-semibold uppercase tracking-wide text-gray-700 mb-1">Discount %</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={form.discountPercentage}
                  onChange={e => setForm({ ...form, discountPercentage: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 font-cormorant text-lg text-gray-800 transition-colors"
                  placeholder="e.g. 15"
                  required
                />
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-cinzel text-xs font-bold uppercase tracking-wide transition-all shadow-md hover:shadow-lg bg-[#111] text-white">
                <Plus size={16} /> Create Coupon
              </button>
            </form>
          </div>
        </div>

        {/* Coupon List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 pl-6 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">Code</th>
                  <th className="p-4 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">Discount</th>
                  <th className="p-4 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">Status</th>
                  <th className="p-4 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">Created</th>
                  <th className="p-4 pr-6 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-gray-500 font-cormorant italic text-lg">No coupons found.</td></tr>
                ) : coupons.map(coupon => (
                  <tr key={coupon._id} className="hover:bg-[#FFFCF5] transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-gray-900">{coupon.code}</td>
                    <td className="p-4 text-green-700 font-bold">{coupon.discountPercentage}%</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {coupon.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 font-cormorant text-lg">
                      {new Date(coupon.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-6 text-right flex justify-end gap-2">
                      <button
                        onClick={() => handleToggle(coupon._id)}
                        className={`p-1.5 rounded transition-colors ${coupon.isActive ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                        title={coupon.isActive ? 'Disable Coupon' : 'Enable Coupon'}
                      >
                        {coupon.isActive ? <PowerOff size={16} /> : <Power size={16} />}
                      </button>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                        title="Delete Coupon"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCoupons;
