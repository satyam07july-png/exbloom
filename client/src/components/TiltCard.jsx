import React, { useRef, useState, useCallback } from 'react';

/**
 * TiltCard - Reusable 3D Parallax Tilt Card Component
 * Provides genuine 60-120fps GPU-accelerated 3D perspective rotation,
 * dynamic specular glare reflection, depth shadow, and touch support.
 */
export const TiltCard = ({
  children,
  className = '',
  maxTilt = 10,
  perspective = 1000,
  scale = 1.02,
  glare = true,
  onClick,
  ...props
}) => {
  const cardRef = useRef(null);
  const rafId = useRef(null);

  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
    transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease',
  });

  const [glareState, setGlareState] = useState({
    x: 50,
    y: 50,
    opacity: 0,
  });

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles
      const rotateX = ((y - centerY) / centerY) * -maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      // Dynamic shadow displacement (shifts opposite to tilt direction)
      const shadowX = -rotateY * 1.5;
      const shadowY = rotateX * 1.5 + 16;

      if (rafId.current) cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        setTiltStyle({
          transform: `perspective(${perspective}px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`,
          boxShadow: `${shadowX.toFixed(1)}px ${shadowY.toFixed(1)}px 30px -4px rgba(27, 77, 62, 0.16), 0 10px 15px -3px rgba(0, 0, 0, 0.05)`,
          transition: 'transform 0.08s ease-out, box-shadow 0.08s ease-out',
        });

        if (glare) {
          setGlareState({
            x: (x / rect.width) * 100,
            y: (y / rect.height) * 100,
            opacity: 0.18,
          });
        }
      });
    },
    [maxTilt, perspective, scale, glare]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease',
    });
    setGlareState((prev) => ({ ...prev, opacity: 0 }));
  }, [perspective]);

  const handleTouchStart = useCallback(() => {
    setTiltStyle((prev) => ({
      ...prev,
      transform: `perspective(${perspective}px) scale3d(0.98, 0.98, 0.98)`,
      transition: 'transform 0.15s ease-out',
    }));
  }, [perspective]);

  const handleTouchEnd = useCallback(() => {
    setTiltStyle((prev) => ({
      ...prev,
      transform: `perspective(${perspective}px) scale3d(1, 1, 1)`,
      transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
    }));
  }, [perspective]);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
      style={{
        ...tiltStyle,
        transformStyle: 'preserve-3d',
      }}
      className={`relative will-change-transform ${className}`}
      {...props}
    >
      {children}

      {/* 3D Specular Light Glare Layer */}
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300 overflow-hidden z-30"
          style={{
            opacity: glareState.opacity,
            background: `radial-gradient(circle 320px at ${glareState.x}% ${glareState.y}%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 70%)`,
          }}
        />
      )}
    </div>
  );
};
