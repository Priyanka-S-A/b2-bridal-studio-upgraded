import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Wifi, WifiOff, ExternalLink, Trash2 } from 'lucide-react';

const API = 'http://localhost:5000';

const Revenue = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, online: 0, offline: 0, count: 0 });
  const [filter, setFilter] = useState('all'); // 'all' | 'online' | 'offline'

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const [entriesRes, statsRes] = await Promise.all([
          axios.get(`${API}/api/revenue`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API}/api/revenue/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setEntries(entriesRes.data);
        setStats(statsRes.data);
      } catch (err) {
        console.error('Failed to fetch revenue', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this revenue entry?")) return;
    console.log("Deleting ID:", id);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API}/api/revenue/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove entry from UI instantly
      setEntries(prev => prev.filter(e => e._id !== id));
      
      // Optionally re-fetch stats to keep dashboard accurate
      const statsRes = await axios.get(`${API}/api/revenue/stats`, { headers: { Authorization: `Bearer ${token}` } });
      setStats(statsRes.data);
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const filtered = filter === 'all' ? entries : entries.filter(e => e.source === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold admin-heading mb-6">Revenue Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Total Revenue</div>
          <div className="text-3xl font-bold text-gray-900">₹{stats.total?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-gray-400 mt-1">{stats.count} bills generated</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-1.5 mb-1">
            <Wifi size={12} className="text-blue-400" />
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Online</div>
          </div>
          <div className="text-3xl font-bold text-blue-600">₹{stats.online?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-gray-400 mt-1">{entries.filter(e => e.source === 'online').length} booking bills</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-1.5 mb-1">
            <WifiOff size={12} className="text-amber-500" />
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Offline</div>
          </div>
          <div className="text-3xl font-bold text-amber-600">₹{stats.offline?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-gray-400 mt-1">{entries.filter(e => e.source === 'offline').length} walk-in bills</div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all', label: 'All' },
          { key: 'online', label: 'Online' },
          { key: 'offline', label: 'Offline' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filter === f.key
                ? 'bg-black text-amber-400'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Revenue Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Source</th>
                <th className="p-4">Mode</th>
                <th className="p-4">Total</th>
                <th className="p-4 pr-6">Bill</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-400 text-sm">
                    {entries.length === 0
                      ? 'No revenue yet. Revenue is recorded when bills are generated.'
                      : 'No entries match this filter.'}
                  </td>
                </tr>
              ) : (
                filtered.map(entry => (
                  <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-6 text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900 text-sm">{entry.customer}</div>
                      {entry.branch && <div className="text-xs text-gray-400">{entry.branch}</div>}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        entry.source === 'online'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {entry.source === 'online' ? <Wifi size={10} /> : <WifiOff size={10} />}
                        {entry.source}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">{entry.mode || '—'}</td>
                    <td className="p-4">
                      <span className="font-bold text-gray-900">
                        ₹{Number(entry.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center gap-2">
                        {entry.billId ? (
                          <a
                            href={`/bill/${entry.billId?._id || entry.billId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="admin-btn-primary"
                          >
                            <ExternalLink size={12} /> View
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="admin-btn-danger"
                          title="Delete Revenue"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
