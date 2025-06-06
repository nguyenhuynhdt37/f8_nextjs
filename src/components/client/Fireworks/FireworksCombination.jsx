'use client';
import React, { useEffect, useState } from 'react';

const FireworksCombination = ({ show, duration = 5000, onComplete }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (show) {
      console.log('FireworksCombination triggered');
      setActive(true);
      
      // Play success sound
      try {
        const audio = new Audio('/sounds/success.mp3');
        audio.volume = 0.5;
        audio.play().catch(err => console.warn('Audio play failed:', err));
      } catch (error) {
        console.warn('Error playing audio:', error);
      }
      
      const timer = setTimeout(() => {
        setActive(false);
        if (onComplete) {
          onComplete();
        }
      }, duration);
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [show, duration, onComplete]);
  
  if (!show) return null;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 99990,
      pointerEvents: 'none',
      overflow: 'hidden'
    }}>
      {/* Animated background glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)',
        opacity: active ? 0.8 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }} />
      
      {/* Generate multiple firework bursts */}
      {Array.from({ length: 20 }).map((_, index) => (
        <FireworkBurst 
          key={index}
          x={Math.random() * 100}
          y={Math.random() * 70 + 10}
          delay={Math.random() * 2000}
          color={`hsl(${Math.random() * 360}, 100%, 50%)`}
        />
      ))}
      
      {/* Debug indicator */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        padding: '5px 10px',
        background: 'rgba(0,0,0,0.5)',
        color: 'white',
        borderRadius: '20px',
        fontSize: '12px',
        zIndex: 100000,
        boxShadow: '0 0 10px rgba(255,255,255,0.3)',
        border: '1px solid rgba(255,255,255,0.3)'
      }}>
        🎆 Celebration Active
      </div>
    </div>
  );
};

// Individual firework burst component
const FireworkBurst = ({ x, y, delay, color }) => {
  const [exploded, setExploded] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setExploded(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  if (!exploded) return null;
  
  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: '2px',
      height: '2px'
    }}>
      {/* Generate particles for the burst */}
      {Array.from({ length: 20 }).map((_, index) => {
        const angle = (index / 20) * Math.PI * 2;
        const distance = 30 + Math.random() * 30;
        const duration = 0.5 + Math.random() * 1;
        const size = 2 + Math.random() * 3;
        
        return (
          <div 
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              backgroundColor: color,
              boxShadow: `0 0 ${size * 2}px ${color}`,
              animation: `particle-${angle} ${duration}s forwards ease-out`,
            }}
          />
        );
      })}
      
      <style jsx>{`
        @keyframes particle-${Math.PI} {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(${Math.sin(Math.PI) * 100}px, ${Math.cos(Math.PI) * 100}px) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default FireworksCombination;
