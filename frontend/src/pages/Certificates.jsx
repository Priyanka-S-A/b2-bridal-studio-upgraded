import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Certificate = () => {
  const [selectedCert, setSelectedCert] = useState(null);

  const certificates = [
    { img: "/images/cert1.jpeg", title: "Advanced Beautician" },
    { img: "/images/cert2.jpeg", title: "Aari Embroidery" },
    { img: "/images/cert3.jpeg", title: "Vaishnavi Jain" },
    { img: "/images/cert4.jpeg", title: "Fruits & Vegetable Processing" },
    { img: "/images/cert5.jpeg", title: "Bakery Products" },
    { img: "/images/cert6.jpeg", title: "Homemade Chocolate Making" },
    { img: "/images/cert7.jpeg", title: "Imitation Jewellery" },
    { img: "/images/cert8.jpeg", title: "Digital Marketing" },
    { img: "/images/cert9.jpeg", title: "Classic Haircut Seminar" },
    { img: "/images/cert10.jpeg", title: "Palm Leaf Fancy Articles Making" },
  ];

  return (
    <div style={{ background: "linear-gradient(180deg, #000 0%, #0a0800 50%, #000 100%)", minHeight: "100vh" }}>

      {/* Hero Banner */}
      <div className="page-hero text-center">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="gold-divider" style={{ width: '40px' }} />
            <span className="font-cinzel text-[0.65rem] tracking-[0.4em] uppercase" style={{ color: '#FFD700' }}>
              Recognition
            </span>
            <div className="gold-divider" style={{ width: '40px' }} />
          </div>
          <h1 className="font-cinzel font-bold uppercase" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#F8F5F0', letterSpacing: '0.05em' }}>
            Certificates
          </h1>
          <p className="font-cormorant italic mt-4" style={{ fontSize: '1.2rem', color: 'rgba(248,245,240,0.92)' }}>
            Our Achievements & Training Programs
          </p>
        </div>
      </div>

      {/* GRID SECTION */}
      <div
        style={{
          padding: "20px 20px 80px",
        }}
      >
        <div
          style={{
            maxWidth: "1300px",
            margin: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            justifyItems: "center"
          }}
        >
          {certificates.map((item, index) => (
            <div
              key={index}
              onClick={() => setSelectedCert(item)}
              className="glass-gold flex flex-col group cursor-pointer transition-all duration-500"
              style={{
                width: '100%',
                maxWidth: '360px',
                height: '440px',
                border: '1px solid rgba(255,195,0,0.18)',
                overflow: 'hidden',
                background: 'rgba(255, 195, 0, 0.03)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,195,0,0.5)';
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(255,195,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,195,0,0.18)';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* IMAGE CONTAINER */}
              <div
                style={{
                  width: "100%",
                  height: "340px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.img}
                  alt="certificate"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    padding: "0px",
                  }}
                />
              </div>

              {/* TITLE */}
              <div className="p-4 flex flex-col justify-between flex-1 items-center text-center">
                <div
                  className="font-cormorant font-semibold leading-snug"
                  style={{ fontSize: '1.25rem', color: '#F8F5F0' }}
                >
                  {item.title}
                </div>
                <div className="mt-2 flex justify-center items-center w-full">
                  <div className="gold-divider" style={{ width: '30px' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            onClick={() => setSelectedCert(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <motion.img
              src={selectedCert.img}
              alt={selectedCert.title}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.4 }}
              style={{
                maxHeight: '90vh',
                maxWidth: '90vw',
                objectFit: 'contain',
                border: '2px solid rgba(255,195,0,0.5)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Certificate;