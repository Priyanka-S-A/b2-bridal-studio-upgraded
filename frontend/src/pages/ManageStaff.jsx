import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Plus, Trash2 } from 'lucide-react';
const API = import.meta.env.VITE_API_URL;
const ManageStaff = () => {
  const [staffList, setStaffList] = useState([]);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    age: ''
  });

  // 📥 Fetch staff
  const fetchStaff = async () => {
    const res = await axios.get(`${API}/api/staff`);
    setStaffList(res.data);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // ✅ VALIDATION FUNCTION
  const validateForm = () => {
    // Phone → exactly 10 digits
    if (!/^\d{10}$/.test(form.phone)) {
      alert("Phone number must be exactly 10 digits");
      return false;
    }

    // Age → only numbers
    if (!/^\d+$/.test(form.age)) {
      alert("Age must be a number");
      return false;
    }

    // Email → valid format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert("Enter a valid email");
      return false;
    }

    return true;
  };

  // ➕ Add staff
  const handleAdd = async () => {
    if (!form.name || !form.phone || !form.email || !form.age) {
      alert('Fill all fields');
      return;
    }

    // ✅ VALIDATION CHECK
    if (!validateForm()) return;

    await axios.post(`${API}/api/staff`, form);

    setForm({
      name: '',
      phone: '',
      email: '',
      age: ''
    });

    fetchStaff();
  };

  // ❌ Delete staff
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    await axios.delete(`${API}/api/staff/${id}`);
    fetchStaff();
  };

  return (
    <div className="bg-[#FDFDFD] min-h-screen p-4 md:p-8 font-sans text-gray-900">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-cinzel uppercase tracking-wide text-gray-900 flex items-center gap-3">
          <Users size={24} className="text-[#D4AF37]" />
          Staff Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">Manage your studio team members.</p>
      </div>

      {/* ➕ ADD FORM */}
      <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] p-6 mb-8 border border-gray-100">
        <h3 className="text-sm font-cinzel font-bold uppercase tracking-wide mb-5 pb-3 text-gray-700" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>Add New Staff</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-cinzel font-semibold uppercase tracking-wide text-gray-700">Full Name <span className="text-amber-600">*</span></label>
            <input
              placeholder="Staff name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 font-cormorant text-lg text-gray-800 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-cinzel font-semibold uppercase tracking-wide text-gray-700">Phone <span className="text-amber-600">*</span></label>
            <input
              placeholder="10-digit number"
              value={form.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                if (value.length <= 10) {
                  setForm({ ...form, phone: value });
                }
              }}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 font-cormorant text-lg text-gray-800 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-cinzel font-semibold uppercase tracking-wide text-gray-700">Email <span className="text-amber-600">*</span></label>
            <input
              placeholder="email@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 font-cormorant text-lg text-gray-800 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-cinzel font-semibold uppercase tracking-wider text-gray-500">Age <span className="text-amber-600">*</span></label>
            <input
              placeholder="Age"
              value={form.age}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setForm({ ...form, age: value });
              }}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 font-cormorant text-lg text-gray-800 transition-colors"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleAdd} className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-cinzel text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg bg-[#111] text-white">
            <Plus size={16} className="text-[#FFD700]" /> Add Staff
          </button>
        </div>
      </div>

      {/* 📋 STAFF LIST */}
      <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 pl-6 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">Staff ID</th>
                <th className="p-4 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">Name</th>
                <th className="p-4 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">Phone</th>
                <th className="p-4 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">Email</th>
                <th className="p-4 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">Age</th>
                <th className="p-4 pr-6 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {staffList.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center text-gray-500 font-cormorant italic text-lg">No staff members found.</td></tr>
              ) : staffList.map((s) => (
                <tr key={s._id} className="hover:bg-[#FFFCF5] transition-colors">
                  <td className="p-4 pl-6 font-mono font-bold text-sm text-amber-700">{s.staffId || 'N/A'}</td>
                  <td className="p-4 font-medium text-gray-900 font-playfair">{s.name}</td>
                  <td className="p-4 text-gray-600 font-cormorant text-lg">{s.phone}</td>
                  <td className="p-4 text-gray-600 font-cormorant text-lg">{s.email}</td>
                  <td className="p-4 text-gray-600 font-cormorant text-lg">{s.age}</td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete Staff"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageStaff;