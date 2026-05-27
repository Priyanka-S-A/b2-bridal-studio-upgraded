import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Save, X, Package, ImageIcon } from 'lucide-react';
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
    <div className="bg-[#FDFDFD] min-h-screen p-4 md:p-8 font-sans text-gray-900">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold font-cinzel uppercase tracking-wide text-gray-900 flex items-center gap-3">
            <Package size={24} className="text-[#D4AF37]" />
            Manage Products
          </h1>
          <p className="text-sm text-gray-600 mt-1">Add, edit and manage your product catalogue.</p>
        </div>

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
            className="flex items-center gap-2 px-5 py-2 rounded-lg font-cinzel text-xs font-bold uppercase tracking-wide transition-all shadow-md hover:shadow-lg bg-[#111] text-white"
          >
            <Plus size={18} /> Add Product
          </button>
        )}
      </div>

      {/* FORM */}
      {isEditing && (
        <div className="bg-white p-5 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] border border-gray-100 mb-6 max-w-xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-cinzel font-bold uppercase tracking-wide text-gray-700">
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
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 text-sm"
              required
            />

            <input
              type="text"
              placeholder="Category"
              value={currentProduct.category || ''}
              onChange={e => setCurrentProduct({ ...currentProduct, category: e.target.value })}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 text-sm"
              required
            />

            <input
              type="number"
              placeholder="Price"
              value={currentProduct.price || ''}
              onChange={e => setCurrentProduct({ ...currentProduct, price: e.target.value })}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 text-sm"
              required
            />

            <input
              type="number"
              placeholder="Stock"
              value={currentProduct.stock || ''}
              onChange={e => setCurrentProduct({ ...currentProduct, stock: e.target.value })}
              className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]/30 bg-gray-50 text-sm"
              required
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCurrentProduct({ ...currentProduct, image: e.target.files[0] })
              }
              className="w-full text-sm file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-cinzel file:font-bold file:uppercase file:tracking-wide file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 file:cursor-pointer file:transition-colors"
            />

            <div className="flex gap-3 pt-2">
              <button className="flex items-center gap-2 px-5 py-2 rounded-lg font-cinzel text-xs font-bold uppercase tracking-wide transition-all shadow-md hover:shadow-lg bg-[#111] text-white">
                <Save size={16} /> Save
              </button>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-cinzel text-xs font-bold uppercase tracking-wide border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PRODUCT GRID or EMPTY STATE */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
            style={{ background: '#F9F7F2', border: '1.5px dashed #D4AF37' }}
          >
            <Package size={32} strokeWidth={1.2} style={{ color: '#D4AF37' }} />
          </div>
          <h2 className="text-lg font-bold font-cinzel uppercase tracking-wide text-gray-800 mb-2">
            No Products Found
          </h2>
          <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
            Click <span className="font-semibold text-gray-700">'Add Product'</span> to create your first product.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(p => (
            <div
              key={p._id}
              className="bg-white rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all p-3 border border-gray-100"
            >
              <div className="h-44 bg-gray-50 rounded-lg overflow-hidden mb-3 flex items-center justify-center">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-300">
                    <ImageIcon size={36} strokeWidth={1.2} />
                    <span className="text-xs text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              <h3 className="font-semibold text-base text-gray-900">{p.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{p.category}</p>

              <div className="flex justify-between items-center mt-2">
                <span className="text-amber-700 font-bold text-sm font-cinzel">
                  ₹{p.price}
                </span>
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">
                  {p.stock} left
                </span>
              </div>

              {/* ✅ FIXED BUTTONS */}
              <div className="flex justify-end gap-2 mt-3 pt-2 border-t border-gray-50">

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
                  className="p-2 rounded-md text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ManageProducts;