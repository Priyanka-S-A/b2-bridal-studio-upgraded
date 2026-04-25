import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeUp, staggerContainer } from '../animations/variants';

const GALLERY_TABS = ['All', 'Bridal', 'Makeup', 'Hair', 'Mehandi', 'Nails', 'Embroidery', 'Fashion'];

const GALLERY_IMAGES = [
  { id: 1, src: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80', category: 'Bridal', title: 'South Indian Bride' },
  { id: 2, src: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', category: 'Makeup', title: 'HD Bridal Makeup' },
  { id: 3, src: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80', category: 'Fashion', title: 'Saree Collection' },
  { id: 4, src: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?auto=format&fit=crop&w=600&q=80', category: 'Nails', title: 'Bridal Nail Art' },
  { id: 5, src: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80', category: 'Mehandi', title: 'Arabic Mehandi' },
  { id: 6, src: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=600&q=80', category: 'Makeup', title: 'Pre-Bridal Glow' },
  { id: 7, src: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80', category: 'Hair', title: 'Bridal Bun' },
  { id: 8, src: 'https://images.unsplash.com/photo-1562322140-8baeacacf376?auto=format&fit=crop&w=600&q=80', category: 'Embroidery', title: 'Aari Work' },
  { id: 9, src: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80', category: 'Bridal', title: 'Bridal Jewellery' },
  { id: 10, src: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80', category: 'Makeup', title: 'Makeup Tools' },
  { id: 11, src: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80', category: 'Fashion', title: 'Fashion Designing' },
  { id: 12, src: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80', category: 'Nails', title: 'Gold Nail Art' },
];

const Gallery = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  const filtered = activeTab === 'All' ? GALLERY_IMAGES : GALLERY_IMAGES.filter(i => i.category === activeTab);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {/* Hero */}
      <div className="page-hero">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-4">
            <div className="gold-divider" style={{ width: '40px' }} />
            <span className="font-cinzel text-[0.65rem] tracking-[0.4em] uppercase" style={{ color: '#FFD700' }}>Portfolio</span>
            <div className="gold-divider" style={{ width: '40px' }} />
          </motion.div>
          <motion.h1 variants={fadeUp} className="font-cinzel font-bold uppercase" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F8F5F0', letterSpacing: '0.05em' }}>
            Our Gallery
          </motion.h1>
          <motion.p variants={fadeUp} className="font-cormorant italic mt-4" style={{ fontSize: '1.15rem', color: 'rgba(248,245,240,0.5)' }}>
            A curated showcase of beauty transformations and artistry.
          </motion.p>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 pt-8 pb-4">
        <div className="flex flex-wrap justify-center gap-2">
          {GALLERY_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="font-cinzel text-[0.6rem] tracking-[0.15em] uppercase px-4 py-2 transition-all duration-300 rounded-sm"
              style={{
                background: activeTab === tab ? 'rgba(255,195,0,0.15)' : 'transparent',
                border: `1px solid ${activeTab === tab ? 'rgba(255,195,0,0.5)' : 'rgba(255,195,0,0.12)'}`,
                color: activeTab === tab ? '#FFD700' : 'rgba(248,245,240,0.5)',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 py-8 pb-20">
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="relative group cursor-pointer img-zoom-container"
                style={{ aspectRatio: '1/1', border: '1px solid rgba(255,195,0,0.08)' }}
                onClick={() => setLightbox(item)}
              >
                <img src={item.src} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3), rgba(255,195,0,0.05))' }}>
                  <span className="font-cinzel text-[0.5rem] tracking-[0.25em] uppercase px-2 py-0.5 mb-1" style={{ background: 'rgba(255,195,0,0.9)', color: '#000' }}>{item.category}</span>
                  <span className="font-playfair text-sm" style={{ color: '#F8F5F0' }}>{item.title}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lightbox-overlay" onClick={() => setLightbox(null)}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="relative max-w-4xl max-h-[85vh] mx-4" onClick={e => e.stopPropagation()}>
              <img src={lightbox.src} alt={lightbox.title} className="w-full h-full object-contain" style={{ maxHeight: '85vh' }} />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-center" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)' }}>
                <span className="font-cinzel text-[0.6rem] tracking-[0.25em] uppercase" style={{ color: '#FFD700' }}>{lightbox.category}</span>
                <span className="mx-3" style={{ color: 'rgba(248,245,240,0.2)' }}>·</span>
                <span className="font-playfair text-sm" style={{ color: '#F8F5F0' }}>{lightbox.title}</span>
              </div>
              <button onClick={() => setLightbox(null)} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.7)', color: '#FFD700', border: '1px solid rgba(255,195,0,0.3)' }}>✕</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;