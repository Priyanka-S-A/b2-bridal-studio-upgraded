import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User, ShoppingBag } from 'lucide-react';
const API = import.meta.env.VITE_API_URL;
const ViewBookings = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBills = async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const res = await axios.get(`${API}/api/billing`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBills(res.data);
      } catch (err) {
        setError('Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  if (loading) return <div className="text-center py-10">Loading bookings...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold admin-heading">Bookings & Bills</h2>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-900 text-white text-sm font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items/Services</th>
                <th className="p-4">Type</th>
                <th className="p-4 pr-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bills.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500">No bookings found.</td></tr>
              ) : bills.map((bill) => (
                <tr key={bill._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-2 font-semibold text-gray-900">
                      <Calendar size={16} className="text-gray-800" />
                      {new Date(bill.date).toLocaleDateString()}
                    </div>
                    {bill.customerDetails?.date && (
                      <div className="text-xs text-gray-500 mt-1 pl-6">
                        Scheduled: {bill.customerDetails.date} at {bill.customerDetails.time}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-900">
                      <User size={16} className="text-gray-400" />
                      {bill.customerDetails?.name || 'Walk-in / Unknown'}
                    </div>
                    {bill.customerDetails?.phone && (
                      <div className="text-xs text-gray-500 pl-6">{bill.customerDetails.phone}</div>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    <ul className="list-disc pl-4 space-y-1">
                      {bill.items.map((item, i) => (
                        <li key={i}>{item.name} <span className="text-gray-400">(₹{item.price})</span></li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                      bill.type === 'service' ? 'bg-blue-50 text-blue-700' :
                      bill.type === 'product' ? 'bg-green-50 text-green-700' :
                      'bg-purple-50 text-purple-700'
                    }`}>
                      {bill.type}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="font-bold text-gray-900 text-lg">₹{bill.total.toFixed(2)}</div>
                    <div className="text-xs text-gray-400 mt-1">inc. GST</div>
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

export default ViewBookings;
