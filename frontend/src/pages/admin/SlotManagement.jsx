import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CalendarOff, Plus, Trash2, Clock, MapPin, AlertCircle, Check } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const HOUR_OPTIONS = [
  { label: '10:00 AM', value: '10' },
  { label: '11:00 AM', value: '11' },
  { label: '12:00 PM', value: '12' },
  { label: '01:00 PM', value: '13' },
  { label: '02:00 PM', value: '14' },
  { label: '03:00 PM', value: '15' },
  { label: '04:00 PM', value: '16' },
  { label: '05:00 PM', value: '17' },
  { label: '06:00 PM', value: '18' },
  { label: '07:00 PM', value: '19' },
];

const END_HOUR_OPTIONS = [
  { label: '11:00 AM', value: '11' },
  { label: '12:00 PM', value: '12' },
  { label: '01:00 PM', value: '13' },
  { label: '02:00 PM', value: '14' },
  { label: '03:00 PM', value: '15' },
  { label: '04:00 PM', value: '16' },
  { label: '05:00 PM', value: '17' },
  { label: '06:00 PM', value: '18' },
  { label: '07:00 PM', value: '19' },
  { label: '08:00 PM', value: '20' },
];

const SlotManagement = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    date: '',
    type: 'Full Day',
    startTime: '10',
    endTime: '13',
    branch: 'All',
    reason: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchBlocks = async () => {
    try {
      const res = await axios.get(`${API}/api/slot-blocks`);
      setBlocks(res.data);
    } catch (err) {
      console.error('Failed to fetch slot blocks', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.date) {
      setError('Date is required');
      return;
    }

    try {
      const postData = {
        date: form.date,
        type: form.type,
        branch: form.branch,
        reason: form.reason
      };

      if (form.type === 'Time Range') {
        postData.startTime = form.startTime;
        postData.endTime = form.endTime;
      }

      await axios.post(`${API}/api/slot-blocks`, postData);
      setSuccess('Slot block created successfully!');
      
      // Reset form but preserve branch
      setForm({
        date: '',
        type: 'Full Day',
        startTime: '10',
        endTime: '13',
        branch: form.branch,
        reason: ''
      });
      
      fetchBlocks();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to block slots');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to unblock this slot/date?')) return;
    try {
      await axios.delete(`${API}/api/slot-blocks/${id}`);
      fetchBlocks();
      setSuccess('Unblocked successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      alert('Failed to delete slot block');
    }
  };

  const getHourLabel = (val, list = HOUR_OPTIONS) => {
    const found = list.find(o => o.value === val);
    return found ? found.label : `${val}:00`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20 text-gray-500 font-cinzel text-lg">
        <div className="w-8 h-8 rounded-full animate-spin border-2 border-gray-200 border-t-[#D4AF37] mr-3" />
        Loading Slot Blocks...
      </div>
    );
  }

  return (
    <div className="bg-[#FDFDFD] min-h-screen p-4 md:p-8 font-sans text-gray-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-cinzel uppercase tracking-wide text-gray-900 flex items-center gap-3">
          <CalendarOff size={26} className="text-[#D4AF37]" />
          Slot Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Manually block booking dates or specific hourly ranges for studios/staff availability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* BLOCK SLOTS FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 p-6 sticky top-6">
            <h3 className="text-sm font-cinzel font-bold uppercase tracking-wide mb-4 pb-3 text-gray-700" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              Add Slot Block
            </h3>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg mb-4 border border-red-100">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 text-xs rounded-lg mb-4 border border-green-100">
                <Check size={16} className="shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              {/* Branch */}
              <div>
                <label className="block text-[0.65rem] font-cinzel font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Select Branch
                </label>
                <select
                  value={form.branch}
                  onChange={e => setForm({ ...form, branch: e.target.value })}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 text-sm transition-all"
                >
                  <option value="All">All Branches</option>
                  <option value="Chennai">Chennai Branch</option>
                  <option value="Madurai">Madurai Branch</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-[0.65rem] font-cinzel font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 text-sm transition-all"
                  required
                />
              </div>

              {/* Block Type */}
              <div>
                <label className="block text-[0.65rem] font-cinzel font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Block Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'Full Day' })}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg font-cinzel tracking-wider uppercase border transition-all ${
                      form.type === 'Full Day'
                        ? 'bg-[#111] text-white border-[#111]'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Full Day
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'Time Range' })}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg font-cinzel tracking-wider uppercase border transition-all ${
                      form.type === 'Time Range'
                        ? 'bg-[#111] text-white border-[#111]'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    Time Range
                  </button>
                </div>
              </div>

              {/* Time Range selection */}
              {form.type === 'Time Range' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-amber-50/40 border border-amber-100 rounded-xl">
                  <div>
                    <label className="block text-[0.55rem] font-cinzel font-bold uppercase tracking-wider text-gray-600 mb-1">
                      Start Time
                    </label>
                    <select
                      value={form.startTime}
                      onChange={e => setForm({ ...form, startTime: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] bg-white text-xs"
                    >
                      {HOUR_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[0.55rem] font-cinzel font-bold uppercase tracking-wider text-gray-600 mb-1">
                      End Time
                    </label>
                    <select
                      value={form.endTime}
                      onChange={e => setForm({ ...form, endTime: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] bg-white text-xs"
                    >
                      {END_HOUR_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-[0.65rem] font-cinzel font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  Reason / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={form.reason}
                  onChange={e => setForm({ ...form, reason: e.target.value })}
                  placeholder="e.g. Studio Maintenance, Staff Holiday"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] bg-gray-50 text-sm transition-all font-cormorant text-base text-gray-800"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg bg-[#111] text-white hover:bg-black"
              >
                <Plus size={16} /> Block Slots
              </button>
            </form>
          </div>
        </div>

        {/* LIST ACTIVE BLOCKED SLOTS */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">
                Active Slot & Day Blocks
              </h3>
            </div>
            
            <div className="divide-y divide-gray-100">
              {blocks.length === 0 ? (
                <div className="p-16 text-center text-gray-400 font-cormorant italic text-lg">
                  No blocked days or slots currently. All time slots are open.
                </div>
              ) : (
                blocks.map((block) => (
                  <div
                    key={block._id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-[#FFFCF5]/50 transition-colors gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)' }}>
                        <CalendarOff size={18} style={{ color: '#D4AF37' }} />
                      </div>
                      
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-[#111] font-mono text-sm tracking-wide">
                            {new Date(block.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          
                          <span className={`px-2 py-0.5 text-[0.6rem] rounded-full font-semibold uppercase tracking-wider font-cinzel ${
                            block.type === 'Full Day' 
                              ? 'bg-red-50 text-red-700 border border-red-100' 
                              : 'bg-amber-50 text-amber-700 border border-amber-100'
                          }`}>
                            {block.type}
                          </span>

                          <span className="inline-flex items-center gap-1 text-[0.65rem] text-gray-500 font-medium font-cinzel">
                            <MapPin size={11} className="text-[#D4AF37]" />
                            {block.branch === 'All' ? 'All Branches' : `${block.branch} Only`}
                          </span>
                        </div>

                        {block.type === 'Time Range' && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <Clock size={12} className="text-gray-400" />
                            <span>
                              {getHourLabel(block.startTime)} &rarr; {getHourLabel(block.endTime, END_HOUR_OPTIONS)}
                            </span>
                          </div>
                        )}

                        {block.reason && (
                          <p className="text-xs text-gray-500 font-cormorant italic text-sm mt-1">
                            &ldquo;{block.reason}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:justify-end">
                      <button
                        onClick={() => handleDelete(block._id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 rounded-lg text-xs font-cinzel font-bold uppercase tracking-wider transition-all"
                        title="Unblock Slots"
                      >
                        <Trash2 size={13} />
                        Unblock
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlotManagement;
