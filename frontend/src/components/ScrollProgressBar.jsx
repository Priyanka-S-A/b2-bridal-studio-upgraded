import React, { useEffect, useState } from 'react';

const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 z-[200] h-[2px] pointer-events-none"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, #FFD700, #FFE566, #FFD700)',
        boxShadow: '0 0 10px rgba(255,195,0,0.6)',
        transition: 'width 0.1s linear',
      }}
    />
  );
};

export default ScrollProgressBar;
