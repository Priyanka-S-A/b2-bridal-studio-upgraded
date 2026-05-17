import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Boxes, Plus, Trash2, X, Minus, Eye } from 'lucide-react';
const API = import.meta.env.VITE_API_URL;
const ManageStock = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  const [form, setForm] = useState({
    productName: '',
    purchaseDate: '',
    totalQuantity: ''
  });

  const [useQty, setUseQty] = useState({});

  // 📥 Fetch data
  const fetchStock = async () => {
    try {
      const res = await axios.get(`${API}/api/stock`);
      setStocks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  // ➕ Add product
  const handleAdd = async () => {
    if (!form.productName || !form.purchaseDate || !form.totalQuantity) {
      alert('Fill all fields');
      return;
    }

    await axios.post(`${API}/api/stock`, form);

    setForm({
      productName: '',
      purchaseDate: '',
      totalQuantity: ''
    });

    fetchStock();
  };

  // ➖ Use product
  const handleUse = async (id) => {
    const qty = useQty[id];

    if (!qty) return alert('Enter quantity');

    await axios.post(`${API}/api/stock/${id}/use`, {
      usedQuantity: Number(qty)
    });

    setUseQty({ ...useQty, [id]: '' });
    fetchStock();
  };

  // ❌ Delete
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this stock item?')) return;
    await axios.delete(`${API}/api/stock/${id}`);
    fetchStock();
  };

  return (
    <div className="bg-[#FDFDFD] min-h-screen p-4 md:p-8 font-sans text-gray-900">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-cinzel uppercase tracking-wide text-gray-900 flex items-center gap-3">
          <Boxes size={24} className="text-[#D4AF37]" />
          Stock Management
        </h1>
        <p className="text-sm text-gray-600 mt-1">Track inventory and product usage.</p>
      </div>

      {/* ADD FORM */}
      <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] p-6 mb-8 border border-gray-100">
        <h3 className="text-sm font-cinzel font-bold uppercase tracking-wide mb-5 pb-3 text-gray-700" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>Add New Product</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-cinzel font-semibold uppercase tracking-wider text-gray-500">Product Name <span className="text-amber-600">*</span></label>
            <input
              placeholder="Product Name"
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 font-cormorant text-lg text-gray-800 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-cinzel font-semibold uppercase tracking-wide text-gray-700">Purchase Date <span className="text-amber-600">*</span></label>
            <input
              type="date"
              value={form.purchaseDate}
              onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 font-cormorant text-lg text-gray-800 transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-cinzel font-semibold uppercase tracking-wider text-gray-500">Total Quantity <span className="text-amber-600">*</span></label>
            <input
              placeholder="Quantity"
              value={form.totalQuantity}
              onChange={(e) => setForm({ ...form, totalQuantity: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 font-cormorant text-lg text-gray-800 transition-colors"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleAdd} className="flex items-center gap-2 px-6 py-2.5 rounded-lg font-cinzel text-xs font-bold uppercase tracking-widest transition-all shadow-md hover:shadow-lg bg-[#111] text-white">
            <Plus size={16} className="text-[#FFD700]" /> Add Product
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 pl-6 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">Name</th>
                <th className="p-4 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">Total</th>
                <th className="p-4 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">Remaining</th>
                <th className="p-4 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">Use</th>
                <th className="p-4 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700">Details</th>
                <th className="p-4 pr-6 text-xs font-cinzel font-bold uppercase tracking-wider text-gray-700 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stocks.length === 0 ? (
                <tr><td colSpan="6" className="p-10 text-center text-gray-500 font-cormorant italic text-lg">No stock items found.</td></tr>
              ) : stocks.map((item) => (
                <tr key={item._id} className="hover:bg-[#FFFCF5] transition-colors">
                  <td className="p-4 pl-6 font-medium text-gray-900 font-playfair">{item.productName}</td>
                  <td className="p-4 text-gray-600 font-cormorant text-lg">{item.totalQuantity}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.remainingQuantity > 0 ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {item.remainingQuantity}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input
                        value={useQty[item._id] || ''}
                        onChange={(e) =>
                          setUseQty({ ...useQty, [item._id]: e.target.value })
                        }
                        className="w-20 p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#FFD700] bg-gray-50 text-sm text-gray-800 transition-colors"
                        placeholder="Qty"
                      />
                      <button
                        onClick={() => handleUse(item._id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-cinzel font-bold uppercase tracking-wider border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
                      >
                        <Minus size={14} /> Use
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => setSelectedStock(item)}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-cinzel font-bold uppercase tracking-wider border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Eye size={14} /> Details
                    </button>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete"
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

      {/* ✅ DETAILS SECTION */}
      {selectedStock && (
        <div className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 mt-6 p-6">
          <div className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
            <h2 className="text-lg font-bold font-cinzel uppercase tracking-wide text-gray-900">Stock Details</h2>
            <button onClick={() => setSelectedStock(null)} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <div className="text-xs font-cinzel font-bold uppercase tracking-wide mb-1 text-gray-700">Product</div>
              <div className="font-medium text-gray-900 font-playfair">{selectedStock.productName}</div>
            </div>
            <div>
              <div className="text-xs font-cinzel font-bold uppercase tracking-widest mb-1 text-gray-400">Purchase Date</div>
              <div className="text-gray-600 font-cormorant text-lg">{new Date(selectedStock.purchaseDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-xs font-cinzel font-bold uppercase tracking-widest mb-1 text-gray-400">Total</div>
              <div className="text-gray-600 font-cormorant text-lg">{selectedStock.totalQuantity}</div>
            </div>
            <div>
              <div className="text-xs font-cinzel font-bold uppercase tracking-widest mb-1 text-gray-400">Remaining</div>
              <div className="font-bold text-amber-700 font-cinzel text-lg">{selectedStock.remainingQuantity}</div>
            </div>
          </div>

          <div className="pt-4" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <h3 className="font-cinzel font-bold text-sm uppercase tracking-wide mb-3 text-gray-700">Usage History</h3>
            {selectedStock.usageHistory?.length === 0 ? (
              <p className="text-gray-500 font-cormorant italic text-lg">No usage yet</p>
            ) : (
              <div className="space-y-2">
                {selectedStock.usageHistory.map((u, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 px-4 rounded-lg bg-gray-50 border border-gray-100">
                    <span className="font-bold text-sm text-amber-700 font-cinzel">{u.usedQuantity}</span>
                    <span className="text-gray-600">used on</span>
                    <span className="text-gray-600 font-cormorant text-lg">{new Date(u.date).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageStock;