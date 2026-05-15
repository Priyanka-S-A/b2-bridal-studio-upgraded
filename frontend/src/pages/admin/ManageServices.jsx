import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Save, X, PlusCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';
const API = import.meta.env.VITE_API_URL;

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

  // Search & Grouping State
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [highlightedServiceId, setHighlightedServiceId] = useState(null);
  const scrollRef = useRef({});

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API}/api/services`);
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
        await axios.put(`${API}/api/services/${currentService._id}`, payload, config);
      } else {
        await axios.post(`${API}/api/services`, payload, config);
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
      await axios.delete(`${API}/api/services/${id}`, {
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

  // Grouping Logic
  const groupServicesByCategory = (data) => {
    if (!Array.isArray(data)) return [];
    const grouped = {};
    data.forEach(service => {
      if (!service || !service.category) return;
      if (!grouped[service.category]) grouped[service.category] = [];
      grouped[service.category].push({
        ...service,
        options: service.options || []
      });
    });
    return Object.keys(grouped).map(category => ({
      category,
      services: grouped[category]
    }));
  };

  const groupedServices = groupServicesByCategory(services);

  // Search Logic
  const filteredCategories = groupedServices.map(cat => {
    const matchedServices = cat.services.filter(service => 
      service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return { ...cat, services: matchedServices };
  }).filter(cat => cat.services.length > 0);

  // Auto-expand and scroll effect
  useEffect(() => {
    if (searchTerm) {
      const newExpanded = {};
      let firstMatchId = null;
      
      filteredCategories.forEach(cat => {
        if (cat.services.length > 0) {
          newExpanded[cat.category] = true;
          if (!firstMatchId) {
            firstMatchId = cat.services[0]._id;
          }
        }
      });
      setExpandedCategories(newExpanded);
      setHighlightedServiceId(firstMatchId);
      
      if (firstMatchId) {
        setTimeout(() => {
          if (scrollRef.current[firstMatchId]) {
            scrollRef.current[firstMatchId].scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    } else {
      setExpandedCategories({});
      setHighlightedServiceId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, services]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h2 className="text-2xl font-bold admin-heading">Manage Services</h2>
        
        {!isEditing && (
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <input 
                type="text" 
                placeholder="Search services by name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 bg-white transition-all shadow-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
            
            <button 
              onClick={() => {
                setCurrentService({ category: '', name: '', price: '', options: [] });
                setIsEditing(true);
              }}
              className="admin-btn-primary whitespace-nowrap w-full sm:w-auto flex justify-center"
            >
              <Plus size={18} /> Add Service
            </button>
          </div>
        )}
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {isEditing ? (
        <div className="admin-card p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold admin-heading">{currentService._id ? 'Edit Service' : 'Add New Service'}</h3>
            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-800 transition-colors">
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
                  className="w-full p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
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
                    className="w-full mt-2 p-2.5 rounded-lg border border-gray-300 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
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
                      <button type="button" onClick={() => removeOption(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
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
        <div className="flex flex-col gap-4">
          {filteredCategories.length === 0 ? (
            <div className="admin-card p-8 text-center text-gray-500">
              No services found matching "{searchTerm}".
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <div key={cat.category} className="admin-card overflow-hidden shadow-sm hover:shadow transition-shadow">
                {/* Category Header (Accordion Toggle) */}
                <button 
                  onClick={() => toggleCategory(cat.category)} 
                  className="w-full px-6 py-4 flex justify-between items-center bg-gray-900 transition-colors hover:bg-gray-800"
                >
                  <span className="font-semibold text-white uppercase tracking-wider text-sm">
                    {cat.category} ({cat.services.length})
                  </span>
                  {expandedCategories[cat.category] ? (
                    <ChevronUp size={20} className="text-[#FFD700]" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400" />
                  )}
                </button>
                
                {/* Expandable Content (Services List) */}
                {expandedCategories[cat.category] && (
                  <div className="border-t border-gray-200">
                    {/* Header Row for layout clarity on desktop */}
                    <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <div className="col-span-5">Service Name</div>
                      <div className="col-span-5">Pricing</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                    
                    {/* Services Items */}
                    <div className="divide-y divide-gray-100">
                      {cat.services.map(service => {
                        const isHighlighted = highlightedServiceId === service._id || (searchTerm && service.name.toLowerCase().includes(searchTerm.toLowerCase()));
                        
                        return (
                          <div 
                            key={service._id} 
                            ref={(el) => (scrollRef.current[service._id] = el)}
                            className={`flex flex-col sm:grid sm:grid-cols-12 gap-4 px-6 py-4 items-start sm:items-center transition-all duration-300 ${
                              isHighlighted 
                                ? 'bg-[#FFFAF0] border-l-4 border-l-[#FFD700]' 
                                : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                            }`}
                            style={isHighlighted ? { boxShadow: 'inset 0 0 15px rgba(255,215,0,0.15)' } : {}}
                          >
                            <div className="col-span-5 w-full">
                              <span className="text-gray-800 font-medium">{service.name}</span>
                            </div>
                            
                            <div className="col-span-5 w-full mt-2 sm:mt-0">
                              {service.options && service.options.length > 0 ? (
                                <div className="space-y-1">
                                  {service.options.map((opt, i) => (
                                    <div key={i} className="text-sm flex justify-between sm:justify-start sm:gap-4">
                                      <span className="text-gray-600">{opt.name}:</span> 
                                      <span className="font-medium text-gray-900">₹{opt.price}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="font-medium text-gray-900">₹{service.price}</span>
                              )}
                            </div>
                            
                            <div className="col-span-2 w-full mt-4 sm:mt-0 flex justify-end gap-3">
                              <button 
                                onClick={() => {
                                  setCurrentService(service);
                                  setIsEditing(true);
                                }}
                                className="admin-btn-edit p-2 shadow-sm"
                                title="Edit Service"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDelete(service._id)}
                                className="admin-btn-danger p-2 shadow-sm"
                                title="Delete Service"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ManageServices;
