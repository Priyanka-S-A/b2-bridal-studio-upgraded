import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
    await axios.delete(`${API}/api/staff/${id}`);
    fetchStaff();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Staff Management</h1>

      {/* ➕ ADD FORM */}
      <div className="space-y-2 mb-6">
        
        {/* Name */}
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 w-full"
        />

        {/* Phone */}
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length <= 10) {
              setForm({ ...form, phone: value });
            }
          }}
          className="border p-2 w-full"
        />

        {/* Email */}
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 w-full"
        />

        {/* Age */}
        <input
          placeholder="Age"
          value={form.age}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setForm({ ...form, age: value });
          }}
          className="border p-2 w-full"
        />

        <button
          onClick={handleAdd}
          className="admin-btn-primary"
        >
          Add Staff
        </button>
      </div>

      {/* 📋 STAFF LIST */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Age</th>
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {staffList.map((s) => (
            <tr key={s._id} className="text-center border-t">
              <td>{s.name}</td>
              <td>{s.phone}</td>
              <td>{s.email}</td>
              <td>{s.age}</td>

              <td>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="admin-btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageStaff;