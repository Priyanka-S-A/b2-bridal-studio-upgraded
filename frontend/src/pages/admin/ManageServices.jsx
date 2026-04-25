import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Save, X, PlusCircle } from 'lucide-react';

const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState({
    category: '',
    name: '',
    price: '',
    options: []
  });

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/services');
      setServices(res.data);
    } catch (err) {
      setError('Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    
    // Cleanup empty options
    const payload = {
      ...currentService,
      options: currentService.options.filter(opt => opt.name && opt.price)
    };
    if (payload.options.length === 0) delete payload.options;

    try {
      if (currentService._id) {
        await axios.put(`http://localhost:5000/api/services/${currentService._id}`, payload, config);
      } else {
        await axios.post('http://localhost:5000/api/services', payload, config);
      }
      setIsEditing(false);
      fetchServices();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save service');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    const token = localStorage.getItem('adminToken');
    try {
      await axios.delete(`http://localhost:5000/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchServices();
    } catch (err) {
      alert('Failed to delete service');
    }
  };

  const addOptionField = () => {
    setCurrentService({
      ...currentService,
      options: [...currentService.options, { name: '', price: '' }]
    });
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...currentService.options];
    newOptions[index][field] = value;
    setCurrentService({ ...currentService, options: newOptions });
  };

  const removeOption = (index) => {
    const newOptions = currentService.options.filter((_, i) => i !== index);
    setCurrentService({ ...currentService, options: newOptions });
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold admin-heading">Manage Services</h2>
        {!isEditing && (
          <button 
            onClick={() => {
              setCurrentService({ category: '', name: '', price: '', options: [] });
              setIsEditing(true);
            }}
            className="admin-btn-primary"
          >
            <Plus size={18} /> Add Service
          </button>
        )}
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {isEditing ? (
        <div className="admin-card p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold admin-heading">{currentService._id ? 'Edit Service' : 'Add New Service'}</h3>
            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-800">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Category</label>
                <select
  value={currentService.category}
  onChange={e => setCurrentService({...currentService, category: e.target.value})}
  className="w-full p-2.5 rounded-lg border border-gray-300"
  required
>
  <option value="">Select Category</option>

  {[...new Set(services.map(s => s.category))].map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ))}

  <option value="NEW">+ Add New Category</option>
</select>

{currentService.category === "NEW" && (
  <input
    type="text"
    placeholder="Enter new category"
    className="w-full mt-2 p-2.5 rounded-lg border border-gray-300"
    onChange={e => setCurrentService({...currentService, category: e.target.value})}
  />
)}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Service Name</label>
                <input 
                  type="text" required 
                  value={currentService.name} 
                  onChange={e => setCurrentService({...currentService, name: e.target.value})}
                  className="w-full p-2.5 rounded-lg border border-gray-300 outline-none focus:border-black focus:ring-1 focus:ring-black"
                  placeholder="e.g. Full Face"
                />
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                Pricing Options
                <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Provide Base Price OR Sub-Options</span>
              </h4>
              
              {currentService.options.length === 0 && (
                <div className="mb-6 max-w-xs">
                  <label className="block text-sm font-medium text-gray-800 mb-1">Base Price (₹)</label>
                  <input 
                    type="number" 
                    value={currentService.price || ''} 
                    onChange={e => setCurrentService({...currentService, price: e.target.value})}
                    className="w-full p-2.5 rounded-lg border border-gray-300 outline-none focus:border-black focus:ring-1 focus:ring-black"
                    placeholder="e.g. 500"
                  />
                </div>
              )}

              {currentService.options.length > 0 && (
                <div className="space-y-3 mb-4">
                  {currentService.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-300">
                      <div className="flex-1">
                        <input 
                          type="text" placeholder="Option Name (e.g. Honey, Fruit)" required
                          value={opt.name} onChange={e => updateOption(idx, 'name', e.target.value)}
                          className="w-full p-2 border-b border-gray-300 bg-transparent outline-none focus:border-black"
                        />
                      </div>
                      <div className="w-32">
                        <input 
                          type="number" placeholder="Price (₹)" required
                          value={opt.price} onChange={e => updateOption(idx, 'price', e.target.value)}
                          className="w-full p-2 border-b border-gray-300 bg-transparent outline-none focus:border-black"
                        />
                      </div>
                      <button type="button" onClick={() => removeOption(idx)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button 
                type="button" 
                onClick={addOptionField}
                className="flex items-center gap-2 text-sm text-black hover:text-gray-600 font-medium transition-colors"
              >
                <PlusCircle size={16} /> Add Sub-Option
              </button>
            </div>

            <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
              <button 
                type="button" onClick={() => setIsEditing(false)}
                className="admin-btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="admin-btn-primary"
              >
                <Save size={18} /> Save Service
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white text-sm font-semibold uppercase tracking-wider">
                  <th className="p-4 pl-6">Category</th>
                  <th className="p-4">Service Name</th>
                  <th className="p-4">Pricing</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {services.length === 0 ? (
                  <tr><td colSpan="4" className="p-8 text-center text-gray-500">No services found.</td></tr>
                ) : services.map(service => (
                  <tr key={service._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 pl-6 font-medium text-gray-900">{service.category}</td>
                    <td className="p-4 text-gray-800">{service.name}</td>
                    <td className="p-4">
                      {service.options && service.options.length > 0 ? (
                        <div className="text-sm">
                          {service.options.map((opt, i) => (
                            <div key={i} className="text-gray-600">
                              <span className="font-medium text-gray-800">{opt.name}:</span> ₹{opt.price}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-900 font-medium">₹{service.price}</span>
                      )}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => {
                            setCurrentService(service);
                            setIsEditing(true);
                          }}
                          className="admin-btn-edit p-2"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(service._id)}
                          className="admin-btn-danger p-2"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageServices;
