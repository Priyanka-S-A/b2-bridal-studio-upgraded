import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
const API = import.meta.env.VITE_API_URL;
const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    _id: null,
    name: '',
    price: '',
    category: '',
    stock: '',
    image: null
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/api/products`);
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    const formData = new FormData();
    formData.append('name', currentProduct.name);
    formData.append('category', currentProduct.category);
    formData.append('price', currentProduct.price);
    formData.append('stock', currentProduct.stock);

    if (currentProduct.image) {
      formData.append('image', currentProduct.image);
    }

    try {
      if (currentProduct._id) {
        await axios.put(
          `${API}/api/products/${currentProduct._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          `${API}/api/products`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setIsEditing(false);
      setCurrentProduct({
        _id: null,
        name: '',
        category: '',
        price: '',
        stock: '',
        image: null
      });

      fetchProducts();

    } catch (err) {
      alert("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    const token = localStorage.getItem('adminToken');

    try {
      await axios.delete(`${API}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchProducts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-6 bg-[#fafafa] min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-wide text-black">
          Manage Products
        </h2>

        {!isEditing && (
          <button
            onClick={() => {
              setCurrentProduct({
                _id: null,
                name: '',
                category: '',
                price: '',
                stock: '',
                image: null
              });
              setIsEditing(true);
            }}
            className="admin-btn-primary"
          >
            <Plus size={18} /> Add Product
          </button>
        )}
      </div>

      {/* FORM */}
      {isEditing && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8 max-w-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-black">
              {currentProduct._id ? "Edit Product" : "Add Product"}
            </h3>
            <button onClick={() => setIsEditing(false)}>
              <X />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">

            <input
              type="text"
              placeholder="Product Name"
              value={currentProduct.name || ''}
              onChange={e => setCurrentProduct({ ...currentProduct, name: e.target.value })}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#c9a13b]"
              required
            />

            <input
              type="text"
              placeholder="Category"
              value={currentProduct.category || ''}
              onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={currentProduct.price || ''}
              onChange={e => setCurrentProduct({ ...currentProduct, price: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />

            <input
              type="number"
              placeholder="Stock"
              value={currentProduct.stock || ''}
              onChange={e => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
              className="w-full p-3 border rounded-lg"
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, image: e.target.files[0] })
              }
              className="w-full p-2"
            />

            <div className="flex gap-3">
              <button className="admin-btn-primary">
                <Save size={16} /> Save
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="admin-btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PRODUCT GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div
            key={p._id}
            className="bg-white rounded-2xl shadow hover:shadow-xl transition p-4 border"
          >
            <div className="h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
              {p.image && (
                <img
                  src={p.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <h3 className="font-semibold text-lg">{p.name}</h3>

            <p className="text-sm text-gray-500">{p.category}</p>

            <div className="flex justify-between items-center mt-3">
              <span className="text-[#c9a13b] font-bold text-lg">
                ₹{p.price}
              </span>

              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                {p.stock} left
              </span>
            </div>

            {/* ✅ FIXED BUTTONS */}
            <div className="flex justify-end gap-2 mt-4">

              <button
                onClick={() => {
                  setCurrentProduct({
                    _id: p._id,
                    name: p.name || '',
                    category: p.category || '',
                    price: p.price || '',
                    stock: p.stock || '',
                    image: null
                  });
                  setIsEditing(true);
                }}
                className="admin-btn-edit p-2"
              >
                <Edit2 size={16} />
              </button>

              <button
                onClick={() => handleDelete(p._id)}
                className="admin-btn-danger p-2"
              >
                <Trash2 size={16} />
              </button>

            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ManageProducts;