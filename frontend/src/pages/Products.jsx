import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { fadeUp, staggerContainer } from '../animations/variants';
import { useCart } from '../context/CartContext';

const DEMO_PRODUCTS = [
  { _id: 'p1', name: 'Bridal Makeup Kit Pro', category: 'Makeup', price: 4999, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80' },
  { _id: 'p2', name: 'Silk Thread Jhumka Set', category: 'Jewellery', price: 799, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80' },
  { _id: 'p3', name: 'Aari Embroidery Frame', category: 'Tools', price: 1499, image: 'https://images.unsplash.com/photo-1597696929736-6d13bed8e6a8?auto=format&fit=crop&w=600&q=80' },
  { _id: 'p4', name: 'Gold Leaf Nail Art Kit', category: 'Nails', price: 999, image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80' },
  { _id: 'p5', name: 'Mehandi Cone Premium Pack', category: 'Mehandi', price: 599, image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80' },
  { _id: 'p6', name: 'Hair Styling Tools Bundle', category: 'Hair', price: 3499, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80' },
  { _id: 'p7', name: 'Kundan Making Kit', category: 'Jewellery', price: 1299, image: 'https://images.unsplash.com/photo-1515562141589-67f0d569b41e?auto=format&fit=crop&w=600&q=80' },
  { _id: 'p8', name: 'Bridal Skincare Collection', category: 'Skincare', price: 2999, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&w=600&q=80' },
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const { addToCart, items, openCart } = useCart();

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data.length > 0 ? res.data : DEMO_PRODUCTS))
      .catch(() => setProducts(DEMO_PRODUCTS));
  }, []);

  const isInCart = (id) => items.some(i => (i._id || i.id) === id);

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <div className="page-hero">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-4">
            <div className="gold-divider" style={{ width: '40px' }} />
            <span className="font-cinzel text-[0.65rem] tracking-[0.4em] uppercase" style={{ color: '#FFD700' }}>Shop</span>
            <div className="gold-divider" style={{ width: '40px' }} />
          </motion.div>
          <motion.h1 variants={fadeUp} className="font-cinzel font-bold uppercase" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F8F5F0', letterSpacing: '0.05em' }}>
            Exclusive Products
          </motion.h1>
          <motion.p variants={fadeUp} className="font-cormorant italic mt-4" style={{ fontSize: '1.15rem', color: 'rgba(248,245,240,0.5)' }}>
            Premium beauty tools and artistry supplies, handpicked by our experts.
          </motion.p>
        </motion.div>
      </div>

      {/* Product Grid */}
      <div className="max-w-[1300px] mx-auto px-6 lg:px-12 py-16 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => {
            const inCart = isInCart(product._id);
            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="card-luxury rounded-sm group"
              >
                {/* Image */}
                <div className="img-zoom-container relative" style={{ height: '240px' }}>
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)' }} />

                  {/* Quick add overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    {!inCart && (
                      <button
                        onClick={() => addToCart(product)}
                        className="px-6 py-2 font-cinzel text-[0.6rem] tracking-[0.2em] uppercase transition-all"
                        style={{ background: 'rgba(255,195,0,0.95)', color: '#000' }}
                      >
                        Quick Add
                      </button>
                    )}
                  </div>

                  {/* Category badge */}
                  <span className="absolute top-3 left-3 font-cinzel text-[0.5rem] tracking-[0.2em] uppercase px-2 py-1" style={{ background: 'rgba(0,0,0,0.7)', color: '#FFD700', border: '1px solid rgba(255,195,0,0.2)' }}>
                    {product.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-playfair text-sm mb-2 leading-tight" style={{ color: '#F8F5F0' }}>{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-cinzel text-sm" style={{ color: '#FFD700' }}>₹{product.price?.toLocaleString()}</span>
                    <button
                      onClick={() => inCart ? openCart() : addToCart(product)}
                      className="w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200"
                      style={{
                        border: `1px solid ${inCart ? '#FFD700' : 'rgba(255,195,0,0.3)'}`,
                        background: inCart ? 'rgba(255,195,0,0.15)' : 'transparent',
                        color: '#FFD700',
                      }}
                    >
                      {inCart ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l5 5L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeLinecap="round" strokeLinejoin="round"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Products;