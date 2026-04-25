import React, { useEffect, useState } from 'react';
import axios from 'axios';
const API = import.meta.env.VITE_API_URL;
const ManageStock = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null); // ✅ NEW

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
    await axios.delete(`${API}/api/stock/${id}`);
    fetchStock();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Stock Management</h1>

      {/* ADD FORM */}
      <div className="mb-6 space-y-2">
        <input
          placeholder="Product Name"
          value={form.productName}
          onChange={(e) => setForm({ ...form, productName: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          type="date"
          value={form.purchaseDate}
          onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
          className="border p-2 w-full"
        />

        <input
          placeholder="Total Quantity"
          value={form.totalQuantity}
          onChange={(e) => setForm({ ...form, totalQuantity: e.target.value })}
          className="border p-2 w-full"
        />

        <button
          onClick={handleAdd}
          className="admin-btn-primary"
        >
          Add Product
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>Total</th>
            <th>Remaining</th>
            <th>Use</th>
            <th>Details</th> {/* ✅ NEW */}
            <th>Delete</th>
          </tr>
        </thead>

        <tbody>
          {stocks.map((item) => (
            <tr key={item._id} className="text-center border-t">
              <td>{item.productName}</td>
              <td>{item.totalQuantity}</td>
              <td>{item.remainingQuantity}</td>

              <td>
                <input
                  value={useQty[item._id] || ''}
                  onChange={(e) =>
                    setUseQty({ ...useQty, [item._id]: e.target.value })
                  }
                  className="border w-20 p-1"
                />
                <button
                  onClick={() => handleUse(item._id)}
                  className="admin-btn-edit ml-2"
                >
                  Use
                </button>
              </td>

              {/* ✅ DETAILS BUTTON */}
              <td>
                <button
                  onClick={() => setSelectedStock(item)}
                  className="bg-gray-700 text-white px-2"
                >
                  Details
                </button>
              </td>

              <td>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="admin-btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ DETAILS SECTION */}
      {selectedStock && (
        <div className="mt-6 p-4 border rounded bg-white">
          <h2 className="text-lg font-bold mb-2">Stock Details</h2>

          <p><b>Product:</b> {selectedStock.productName}</p>
          <p>
            <b>Purchase Date:</b>{" "}
            {new Date(selectedStock.purchaseDate).toLocaleDateString()}
          </p>

          <p><b>Total:</b> {selectedStock.totalQuantity}</p>
          <p><b>Remaining:</b> {selectedStock.remainingQuantity}</p>

          <h3 className="mt-3 font-semibold">Usage History:</h3>

          {selectedStock.usageHistory?.length === 0 ? (
            <p>No usage yet</p>
          ) : (
            <ul className="list-disc ml-5">
              {selectedStock.usageHistory.map((u, i) => (
                <li key={i}>
                  {u.usedQuantity}  used on{" "}
                  {new Date(u.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageStock;