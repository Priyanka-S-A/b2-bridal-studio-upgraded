import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { fadeUp, staggerContainer } from '../../animations/variants';

const testimonials = [
  {
    id: 1,
    name: 'Priya Lakshmi',
    role: 'Bride, 2023',
    quote: 'Shammugapriya transformed me into exactly the bride I dreamed of being. The artistry, the attention to detail, and the love poured into every brushstroke — it was a spiritual experience.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=200&q=80',
    stars: 5,
  },
  {
    id: 2,
    name: 'Kavitha Raj',
    role: 'Bride, 2024',
    quote: 'I\'ve been to many studios, but B2 is in a different league entirely. The luxury experience begins the moment you walk in. My bridal look was absolute perfection.',
    image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?auto=format&fit=crop&w=200&q=80',
    stars: 5,
  },
  {
    id: 3,
    name: 'Meena Selvam',
    role: 'Student, Batch 2023',
    quote: 'The training programme at B2 Academy launched my entire career. The techniques, the professionalism, and the personal mentoring — I couldn\'t ask for more from a teacher.',
    image: 'https://images.unsplash.com/photo-1557555187-23d685287bc3?auto=format&fit=crop&w=200&q=80',
    stars: 5,
  },
  {
    id: 4,
    name: 'Deepa Sundar',
    role: 'Bride, 2024',
    quote: 'Every photograph from my wedding is a masterpiece. That is what B2 does — they don\'t just do makeup, they create art that lasts forever.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    stars: 5,
  },
];

const StarRating = ({ count }) => (
  <div className="flex gap-1">
    {Array.from({ length: count }).map((_, i) => (
      <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#FFD700">
        <path d="M7 1l1.6 4.4H13L9.2 8.2l1.4 4.4L7 10l-3.6 2.6L4.8 8.2 1 5.4h4.4z" />
      </svg>
    ))}
  </div>
);

const VideoModal = ({ onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    style={{ background: 'rgba(0,0,0,0.92)' }}
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.85, opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-3xl"
      style={{ border: '1px solid rgba(255,195,0,0.2)' }}
      onClick={e => e.stopPropagation()}
    >
      {/* Placeholder video (no real embed for demo) */}
      <div
        className="w-full flex items-center justify-center"
        style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg, #0a0800, #000)' }}
      >
        <div className="text-center">
          <div className="font-cormorant text-xl italic mb-2" style={{ color: 'rgba(248,245,240,0.6)' }}>
            Video Testimonial
          </div>
          <div className="font-cinzel text-xs tracking-wider uppercase" style={{ color: 'rgba(255,195,0,0.5)' }}>
            Replace with YouTube embed URL
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute -top-4 -right-4 w-8 h-8 rounded-full flex items-center justify-center font-cinzel text-sm"
        style={{ background: '#FFD700', color: '#000' }}
      >
        ✕
      </button>
    </motion.div>
  </motion.div>
);

const Testimonials = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const [active, setActive] = useState(0);
  const [videoOpen, setVideoOpen] = useState(false);

  const prev = () => setActive(a => (a - 1 + testimonials.length) % testimonials.length);
  const next = () => setActive(a => (a + 1) % testimonials.length);

  const current = testimonials[active];

  return (
    <>
      <section
        id="testimonials"
        className="relative overflow-hidden"
        style={{ padding: '5.5rem 0', background: '#000' }}
      >
        {/* Subtle left glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '10%',
            left: '-5%',
            width: '40%',
            height: '80%',
            background: 'radial-gradient(ellipse, rgba(255,195,0,0.04) 0%, transparent 70%)',
          }}
        />

        <div className="max-w-[1300px] mx-auto px-6 lg:px-12" ref={ref}>
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="text-center mb-16"
          >
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-4 mb-4">
              <div className="gold-divider" style={{ width: '40px' }} />
              <span className="font-cinzel text-[0.65rem] tracking-[0.4em] uppercase" style={{ color: '#FFD700' }}>
                06 — Voices
              </span>
              <div className="gold-divider" style={{ width: '40px' }} />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-cinzel font-bold uppercase mb-4"
              style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '0.05em', color: '#F8F5F0' }}
            >
              Client Stories
            </motion.h2>
            <motion.p variants={fadeUp} className="font-cormorant italic" style={{ fontSize: '1.1rem', color: 'rgba(248,245,240,0.5)' }}>
              The most honest reviews — from those who wore our artistry.
            </motion.p>
          </motion.div>

          {/* Testimonial card */}
          <div className="max-w-3xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="glass-dark text-center px-8 py-12"
                style={{ border: '1px solid rgba(255,195,0,0.15)' }}
              >
                {/* Quote mark */}
                <div
                  className="font-playfair font-bold mb-6 leading-none select-none"
                  style={{ fontSize: '5rem', lineHeight: 0.8, color: 'rgba(255,195,0,0.2)' }}
                >
                  "
                </div>

                {/* Stars */}
                <div className="flex justify-center mb-6">
                  <StarRating count={current.stars} />
                </div>

                {/* Quote */}
                <blockquote
                  className="font-cormorant italic leading-relaxed mb-8"
                  style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: 'rgba(248,245,240,0.85)', maxWidth: '600px', margin: '0 auto 2rem' }}
                >
                  {current.quote}
                </blockquote>

                {/* Author */}
                <div className="flex flex-col items-center gap-3">
                  <img
                    src={current.image}
                    alt={current.name}
                    className="w-14 h-14 rounded-full object-cover"
                    style={{ border: '2px solid rgba(255,195,0,0.4)' }}
                  />
                  <div>
                    <div className="font-cinzel text-sm tracking-[0.1em] uppercase" style={{ color: '#F8F5F0' }}>
                      {current.name}
                    </div>
                    <div className="font-cormorant text-xs italic mt-1" style={{ color: 'rgba(255,195,0,0.6)' }}>
                      {current.role}
                    </div>
                  </div>

                  {/* Video play button */}
                  {current.isVideo && (
                    <button
                      onClick={() => setVideoOpen(true)}
                      className="relative mt-2 flex items-center gap-2 group"
                    >
                      <div
                        className="relative w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ border: '1px solid rgba(255,195,0,0.4)', background: 'rgba(255,195,0,0.08)' }}
                      >
                        {/* Ripple */}
                        <div
                          className="absolute inset-0 rounded-full animate-pulse-glow"
                          style={{ border: '1px solid rgba(255,195,0,0.3)' }}
                        />
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="#FFD700">
                          <path d="M2 1l9 5-9 5V1z" />
                        </svg>
                      </div>
                      <span className="font-cinzel text-[0.6rem] tracking-[0.3em] uppercase" style={{ color: 'rgba(255,195,0,0.7)' }}>
                        Watch Review
                      </span>
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-6 mt-10">
              <button
                onClick={prev}
                id="testimonial-prev"
                className="w-12 h-12 flex items-center justify-center transition-all duration-300"
                style={{ border: '1px solid rgba(255,195,0,0.25)', color: 'rgba(255,195,0,0.7)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,195,0,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,195,0,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,195,0,0.25)'; }}
              >
                ←
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className="h-px transition-all duration-300"
                    style={{
                      width: i === active ? '32px' : '12px',
                      background: i === active ? '#FFD700' : 'rgba(255,195,0,0.25)',
                    }}
                  />
                ))}
              </div>

              <button
                onClick={next}
                id="testimonial-next"
                className="w-12 h-12 flex items-center justify-center transition-all duration-300"
                style={{ border: '1px solid rgba(255,195,0,0.25)', color: 'rgba(255,195,0,0.7)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,195,0,0.1)'; e.currentTarget.style.borderColor = 'rgba(255,195,0,0.5)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,195,0,0.25)'; }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}
      </AnimatePresence>
    </>
  );
};

export default Testimonials;
