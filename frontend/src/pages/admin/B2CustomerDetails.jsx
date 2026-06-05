import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Users, Calendar, Mail, Phone, Globe, Layers } from 'lucide-react';

const API = import.meta.env.VITE_API_URL;

const B2CustomerDetails = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [dobOption, setDobOption] = useState('none');

  const fetchCustomerDetails = async () => {
    try {
      const token = sessionStorage.getItem('ownerToken');
      const res = await axios.get(`${API}/api/customer/b2-details`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCustomers(res.data);
    } catch (err) {
      console.error('Failed to fetch B2 customer details', err);
      setError('Failed to fetch customer details. Please make sure you are authorized.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  const formatDob = (dobVal) => {
    if (!dobVal) return <span className="italic text-gray-300">N/A</span>;
    const d = new Date(dobVal);
    if (isNaN(d.getTime())) {
      return dobVal;
    }
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const filtered = customers.filter(c => {
    // Search filter
    const nameMatch = c.name?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = c.email?.toLowerCase().includes(search.toLowerCase());
    const phoneMatch = c.phone?.includes(search);
    const matchesSearch = nameMatch || emailMatch || phoneMatch;

    if (!matchesSearch) return false;

    // Source filter
    if (sourceFilter !== 'All') {
      if (sourceFilter === 'online') {
        if (!c.source.includes('online')) return false;
      } else if (sourceFilter === 'offline') {
        if (!c.source.includes('offline') || c.source.includes('online/offline')) return false;
      }
    }

    // DOB filter
    if (dobOption === 'thisMonth') {
      if (!c.dob) return false;
      const dobMonth = new Date(c.dob).getMonth();
      const currentMonth = new Date().getMonth();
      return dobMonth === currentMonth;
    }
    
    if (dobOption === 'nextMonth') {
      if (!c.dob) return false;
      const dobMonth = new Date(c.dob).getMonth();
      const currentMonth = new Date().getMonth();
      const nextMonth = (currentMonth + 1) % 12;
      return dobMonth === nextMonth;
    }
    
    if (dobOption === 'today') {
      if (!c.dob) return false;
      const dobDate = new Date(c.dob);
      const today = new Date();
      return dobDate.getMonth() === today.getMonth() && dobDate.getDate() === today.getDate();
    }

    if (dobOption.startsWith('month_')) {
      if (!c.dob) return false;
      const targetMonth = parseInt(dobOption.split('_')[1], 10);
      const dobMonth = new Date(c.dob).getMonth();
      return dobMonth === targetMonth;
    }

    return true;
  });

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 rounded-full animate-spin border-2 border-gray-200 border-t-[#D4AF37]"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center font-cormorant text-lg">
      {error}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h3 className="font-cinzel font-bold text-sm uppercase tracking-wide text-gray-800 flex items-center gap-2">
            <Users className="text-[#D4AF37]" size={18} />
            B2 Customer Details
          </h3>
          <p className="text-xs text-gray-500 font-cormorant italic mt-0.5">
            Unified directory of customers who made online bookings or generated offline/online bills.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap w-full lg:w-auto">
          <div className="relative flex-grow sm:flex-initial min-w-[220px]">
            <input
              type="text"
              placeholder="Search Name, Phone, Email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#D4AF37] text-gray-900 placeholder-gray-400"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={14} />
          </div>

          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="p-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#D4AF37] text-gray-900 bg-white"
          >
            <option value="All">All Sources</option>
            <option value="online">Online Booking / Billing</option>
            <option value="offline">Offline walk-in Bills</option>
          </select>

          <select
            value={dobOption}
            onChange={e => setDobOption(e.target.value)}
            className="p-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-[#D4AF37] text-gray-900 bg-white"
          >
            <option value="none">DOB (Birthday Filter)</option>
            <option value="today">Birthdays Today 🎂</option>
            <option value="thisMonth">Birthdays This Month</option>
            <option value="nextMonth">Birthdays Next Month</option>
            <option value="month_0">January</option>
            <option value="month_1">February</option>
            <option value="month_2">March</option>
            <option value="month_3">April</option>
            <option value="month_4">May</option>
            <option value="month_5">June</option>
            <option value="month_6">July</option>
            <option value="month_7">August</option>
            <option value="month_8">September</option>
            <option value="month_9">October</option>
            <option value="month_10">November</option>
            <option value="month_11">December</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-gray-700">
              <th className="p-4 pl-6 text-xs font-cinzel font-bold uppercase tracking-wider">Customer Name</th>
              <th className="p-4 text-xs font-cinzel font-bold uppercase tracking-wider">Phone / Email</th>
              <th className="p-4 text-xs font-cinzel font-bold uppercase tracking-wider">Date of Birth</th>
              <th className="p-4 pr-6 text-xs font-cinzel font-bold uppercase tracking-wider text-right">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-10 text-center font-cormorant italic text-lg text-gray-400">
                  No matching customer details found.
                </td>
              </tr>
            ) : (
              filtered.map((c, idx) => (
                <tr key={idx} className="hover:bg-[#FFFCF5] transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-gray-900 font-playfair text-base">{c.name}</div>
                  </td>
                  <td className="p-4 text-gray-700">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-800">
                      <Phone size={12} className="text-gray-400 shrink-0" />
                      {c.phone || 'N/A'}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-cormorant mt-1">
                      <Mail size={12} className="text-gray-400 shrink-0" />
                      {c.email || 'N/A'}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600 font-cormorant text-lg">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400 shrink-0" />
                      {formatDob(c.dob)}
                    </div>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                      c.source === 'online'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : c.source === 'offline'
                        ? 'bg-gray-50 text-gray-600 border-gray-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {c.source === 'online/offline' ? (
                        <>
                          <Layers size={10} />
                          Online & Offline
                        </>
                      ) : c.source === 'online' ? (
                        <>
                          <Globe size={10} />
                          Online
                        </>
                      ) : (
                        <>
                          <Phone size={10} />
                          Offline
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default B2CustomerDetails;
