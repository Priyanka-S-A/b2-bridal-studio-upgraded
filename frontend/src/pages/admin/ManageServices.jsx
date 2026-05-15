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

  if (loading) return <div className="text-center py-20 flex justify-center"><div className="w-8 h-8 rounded-full animate-spin" style={{ border: '2px solid rgba(255,195,0,0.2)', borderTopColor: '#FFD700' }} /></div>;

  return (
    <div className="bg-[#000] min-h-screen p-4 md:p-8 rounded-lg shadow-xl" style={{ border: '1px solid rgba(255,195,0,0.1)' }}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-bold font-cinzel uppercase tracking-[0.1em]" style={{ color: '#F8F5F0' }}>Manage Services</h2>
          <p className="font-cormorant italic text-lg mt-1" style={{ color: 'rgba(248,245,240,0.5)' }}>Organize and update your premium offerings.</p>
        </div>
        
        {!isEditing && (
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-80 group">
              <input 
                type="text" 
                placeholder="Search services by name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-sm border focus:outline-none transition-all font-cormorant text-lg"
                style={{ 
                  background: 'rgba(255,195,0,0.03)',
                  borderColor: 'rgba(255,195,0,0.2)',
                  color: '#F8F5F0',
                  boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FFD700'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,195,0,0.2)'}
              />
              <Search className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-[#FFD700] transition-colors" size={20} />
            </div>
            
            <button 
              onClick={() => {
                setCurrentService({ category: '', name: '', price: '', options: [] });
                setIsEditing(true);
              }}
              className="whitespace-nowrap w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 rounded-sm font-cinzel text-[0.7rem] uppercase tracking-[0.15em] transition-all font-bold"
              style={{
                background: 'linear-gradient(135deg, #FFD700, #FFE566)',
                color: '#000',
              }}
            >
              <Plus size={16} /> Add Service
            </button>
          </div>
        )}
      </div>

      {error && <div className="text-red-500 mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-sm font-cormorant">{error}</div>}

      {isEditing ? (
        <div className="p-8 rounded-sm mb-8 relative" style={{ background: 'rgba(20,20,20,0.8)', border: '1px solid rgba(255,195,0,0.15)' }}>
          <div className="flex justify-between items-center mb-8 pb-4" style={{ borderBottom: '1px solid rgba(255,195,0,0.1)' }}>
            <h3 className="text-xl font-bold font-cinzel tracking-wider text-[#F8F5F0] uppercase">
              {currentService._id ? 'Edit Service' : 'Add New Service'}
            </h3>
            <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-[#FFD700] transition-colors">
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-cinzel tracking-[0.15em] text-gray-400 uppercase mb-2">Category</label>
                <select
                  value={currentService.category}
                  onChange={e => setCurrentService({...currentService, category: e.target.value})}
                  className="w-full p-3 rounded-sm font-cormorant text-lg focus:outline-none transition-colors"
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,195,0,0.2)', color: '#F8F5F0' }}
                  required
                >
                  <option value="" className="bg-black text-gray-400">Select Category</option>
                  {[...new Set(services.map(s => s.category))].map(cat => (
                    <option key={cat} value={cat} className="bg-black text-[#F8F5F0]">{cat}</option>
                  ))}
                  <option value="NEW" className="bg-black text-[#FFD700]">+ Add New Category</option>
                </select>

                {currentService.category === "NEW" && (
                  <input
                    type="text"
                    placeholder="Enter new category"
                    className="w-full mt-4 p-3 rounded-sm font-cormorant text-lg focus:outline-none transition-colors"
                    style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,195,0,0.4)', color: '#F8F5F0' }}
                    onChange={e => setCurrentService({...currentService, category: e.target.value})}
                  />
                )}
              </div>
              <div>
                <label className="block text-xs font-cinzel tracking-[0.15em] text-gray-400 uppercase mb-2">Service Name</label>
                <input 
                  type="text" required 
                  value={currentService.name} 
                  onChange={e => setCurrentService({...currentService, name: e.target.value})}
                  className="w-full p-3 rounded-sm font-cormorant text-lg focus:outline-none transition-colors"
                  style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,195,0,0.2)', color: '#F8F5F0' }}
                  placeholder="e.g. Premium Bridal Makeup"
                />
              </div>
            </div>

            <div className="pt-8" style={{ borderTop: '1px solid rgba(255,195,0,0.1)' }}>
              <div className="flex items-center gap-4 mb-6">
                <h4 className="text-sm font-cinzel tracking-[0.1em] text-[#F8F5F0] uppercase">Pricing Options</h4>
                <span className="text-[0.65rem] font-cinzel text-[#FFD700] tracking-widest bg-[#FFD700]/10 px-3 py-1 rounded-sm border border-[#FFD700]/20">
                  Base Price OR Sub-Options
                </span>
              </div>
              
              {currentService.options.length === 0 && (
                <div className="mb-6 max-w-sm">
                  <label className="block text-xs font-cinzel tracking-[0.15em] text-gray-400 uppercase mb-2">Base Price (₹)</label>
                  <input 
                    type="number" 
                    value={currentService.price || ''} 
                    onChange={e => setCurrentService({...currentService, price: e.target.value})}
                    className="w-full p-3 rounded-sm font-cormorant text-lg focus:outline-none transition-colors"
                    style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,195,0,0.2)', color: '#F8F5F0' }}
                    placeholder="e.g. 1500"
                  />
                </div>
              )}

              {currentService.options.length > 0 && (
                <div className="space-y-4 mb-6">
                  {currentService.options.map((opt, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-sm" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,195,0,0.1)' }}>
                      <div className="flex-1 w-full">
                        <input 
                          type="text" placeholder="Option Name (e.g. Honey, Fruit)" required
                          value={opt.name} onChange={e => updateOption(idx, 'name', e.target.value)}
                          className="w-full p-2 bg-transparent font-cormorant text-lg focus:outline-none transition-colors"
                          style={{ color: '#F8F5F0', borderBottom: '1px solid rgba(255,195,0,0.3)' }}
                        />
                      </div>
                      <div className="w-full sm:w-40">
                        <input 
                          type="number" placeholder="Price (₹)" required
                          value={opt.price} onChange={e => updateOption(idx, 'price', e.target.value)}
                          className="w-full p-2 bg-transparent font-cormorant text-lg focus:outline-none transition-colors"
                          style={{ color: '#FFD700', borderBottom: '1px solid rgba(255,195,0,0.3)' }}
                        />
                      </div>
                      <button type="button" onClick={() => removeOption(idx)} className="text-gray-500 hover:text-red-500 transition-colors p-2 mt-2 sm:mt-0">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button 
                type="button" 
                onClick={addOptionField}
                className="flex items-center gap-2 text-xs font-cinzel tracking-widest text-[#FFD700] hover:text-[#FFF] uppercase transition-colors"
              >
                <PlusCircle size={16} /> Add Sub-Option
              </button>
            </div>

            <div className="flex justify-end gap-4 pt-8 mt-4" style={{ borderTop: '1px solid rgba(255,195,0,0.1)' }}>
              <button 
                type="button" onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-sm font-cinzel text-[0.7rem] uppercase tracking-[0.15em] transition-all font-bold"
                style={{ background: 'transparent', border: '1px solid rgba(255,195,0,0.3)', color: '#F8F5F0' }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex items-center gap-2 px-6 py-3 rounded-sm font-cinzel text-[0.7rem] uppercase tracking-[0.15em] transition-all font-bold"
                style={{ background: 'linear-gradient(135deg, #FFD700, #FFE566)', color: '#000' }}
              >
                <Save size={16} /> Save Service
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-cormorant text-xl italic" style={{ border: '1px dashed rgba(255,195,0,0.2)', borderRadius: '4px' }}>
              No services found matching "{searchTerm}".
            </div>
          ) : (
            filteredCategories.map((cat) => (
              <div key={cat.category} className="rounded-sm overflow-hidden transition-all duration-300">
                {/* Category Header (Accordion Toggle) */}
                <button 
                  onClick={() => toggleCategory(cat.category)} 
                  className="w-full px-6 py-5 flex justify-between items-center transition-all duration-300 rounded-sm group relative"
                  style={{ 
                    background: expandedCategories[cat.category] ? 'rgba(255,195,0,0.06)' : 'rgba(255,195,0,0.02)',
                    border: expandedCategories[cat.category] ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid rgba(255, 215, 0, 0.1)',
                    boxShadow: expandedCategories[cat.category] ? '0 4px 20px rgba(0,0,0,0.3)' : 'none'
                  }}
                >
                  <div className="flex items-center gap-4 relative z-10">
                    <span className="font-cinzel font-bold tracking-[0.15em] text-[#F8F5F0] text-sm md:text-base uppercase group-hover:text-[#FFD700] transition-colors">
                      {cat.category}
                    </span>
                    <span className="px-3 py-1 rounded-sm text-[0.6rem] font-medium tracking-[0.2em] uppercase bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 hidden sm:block">
                      {cat.services.length} {cat.services.length === 1 ? 'Service' : 'Services'}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 relative z-10">
                    <span className="px-2 py-0.5 rounded-sm text-[0.55rem] font-medium tracking-[0.2em] uppercase bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20 block sm:hidden">
                      {cat.services.length} Serv
                    </span>
                    {expandedCategories[cat.category] ? (
                      <ChevronUp size={20} className="text-[#FFD700] transition-transform" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500 group-hover:text-[#FFD700] transition-transform" />
                    )}
                  </div>
                </button>
                
                {/* Expandable Content (Services List) */}
                {expandedCategories[cat.category] && (
                  <div 
                    className="mt-2 rounded-sm overflow-hidden"
                    style={{
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 215, 0, 0.08)',
                    }}
                  >
                    {/* Header Row for layout clarity on desktop */}
                    <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-8 py-3 border-b text-[0.6rem] font-cinzel text-gray-500 uppercase tracking-[0.2em]" style={{ borderColor: 'rgba(255,195,0,0.1)' }}>
                      <div className="col-span-5">Service</div>
                      <div className="col-span-5">Pricing</div>
                      <div className="col-span-2 text-right">Actions</div>
                    </div>
                    
                    {/* Services Items */}
                    <div className="divide-y" style={{ divideColor: 'rgba(255,195,0,0.05)' }}>
                      {cat.services.map(service => {
                        const isHighlighted = highlightedServiceId === service._id || (searchTerm && service.name.toLowerCase().includes(searchTerm.toLowerCase()));
                        
                        return (
                          <div 
                            key={service._id} 
                            ref={(el) => (scrollRef.current[service._id] = el)}
                            className={`flex flex-col sm:grid sm:grid-cols-12 gap-4 px-8 py-6 items-start sm:items-center transition-all duration-500 ${
                              isHighlighted 
                                ? 'bg-[#FFD700]/5 border-l-4 border-l-[#FFD700]' 
                                : 'hover:bg-white/5 border-l-4 border-l-transparent'
                            }`}
                            style={{
                              borderBottom: '1px solid rgba(255,195,0,0.05)',
                              boxShadow: isHighlighted ? 'inset 0 0 20px rgba(255,215,0,0.05)' : 'none'
                            }}
                          >
                            <div className="col-span-5 w-full">
                              <span className="text-[#F8F5F0] font-playfair text-lg tracking-wide">{service.name}</span>
                            </div>
                            
                            <div className="col-span-5 w-full mt-2 sm:mt-0">
                              {service.options && service.options.length > 0 ? (
                                <div className="space-y-2">
                                  {service.options.map((opt, i) => (
                                    <div key={i} className="flex justify-between sm:justify-start sm:gap-6 font-cormorant text-base">
                                      <span className="text-gray-400">{opt.name}</span> 
                                      <span className="text-[#FFD700] font-medium tracking-wide">₹{opt.price}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-[#FFD700] font-medium font-cormorant text-lg tracking-wide">₹{service.price}</span>
                              )}
                            </div>
                            
                            <div className="col-span-2 w-full mt-4 sm:mt-0 flex justify-end gap-5">
                              <button 
                                onClick={() => {
                                  setCurrentService(service);
                                  setIsEditing(true);
                                }}
                                className="text-gray-500 hover:text-[#FFD700] transition-colors"
                                title="Edit Service"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(service._id)}
                                className="text-gray-500 hover:text-red-500 transition-colors"
                                title="Delete Service"
                              >
                                <Trash2 size={18} />
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
