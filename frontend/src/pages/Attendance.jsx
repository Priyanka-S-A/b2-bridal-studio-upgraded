import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Attendance = () => {
  const [staffList, setStaffList] = useState([]);
  const [records, setRecords] = useState([]);

  const [form, setForm] = useState({
    staffId: '',
    date: '',
    entryTime: '',
    exitTime: ''
  });

  // 📥 Fetch staff
  const fetchStaff = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/staff`);
    setStaffList(res.data);
  };

  // 📥 Fetch attendance
  const fetchAttendance = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/attendance`);
    setRecords(res.data);
  };

  useEffect(() => {
    fetchStaff();
    fetchAttendance();
  }, []);

  // ➕ Add attendance
  const handleAdd = async () => {
    if (!form.staffId || !form.date || !form.entryTime || !form.exitTime) {
      alert("Fill all fields");
      return;
    }

    await axios.post(`${import.meta.env.VITE_API_URL}/api/attendance`, form);

    setForm({
      staffId: '',
      date: '',
      entryTime: '',
      exitTime: ''
    });

    fetchAttendance();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance</h1>

      {/* ➕ FORM */}
      <div className="space-y-2 mb-6">

        {/* Staff Dropdown */}
        <select
          value={form.staffId}
          onChange={(e) => setForm({ ...form, staffId: e.target.value })}
          className="border p-2 w-full"
        >
          <option value="">Select Staff</option>
          {staffList.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Date */}
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="border p-2 w-full"
        />

        {/* Entry */}
        <input
          type="time"
          value={form.entryTime}
          onChange={(e) => setForm({ ...form, entryTime: e.target.value })}
          className="border p-2 w-full"
        />

        {/* Exit */}
        <input
          type="time"
          value={form.exitTime}
          onChange={(e) => setForm({ ...form, exitTime: e.target.value })}
          className="border p-2 w-full"
        />

        <button
          onClick={handleAdd}
          className="admin-btn-primary"
        >
          Mark Attendance
        </button>
      </div>

      {/* 📋 TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Staff</th>
            <th>Date</th>
            <th>Entry</th>
            <th>Exit</th>
          </tr>
        </thead>

        <tbody>
          {records.map((r) => (
            <tr key={r._id} className="text-center border-t">
              <td>{r.staffId?.name}</td>
              <td>{new Date(r.date).toLocaleDateString()}</td>
              <td>{r.entryTime}</td>
              <td>{r.exitTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Attendance;