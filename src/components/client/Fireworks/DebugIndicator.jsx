'use client';
import React, { useEffect, useState } from 'react';

/**
 * DebugIndicator component - shows a small indicator when fireworks are triggered
 * This is useful for debugging visual effects in the application
 */
const DebugIndicator = ({ active, label = "Debug", color = "red" }) => {
  if (!active) return null;
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      zIndex: 100000,
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      padding: '5px 10px',
      background: 'rgba(0,0,0,0.7)',
      borderRadius: '15px',
      fontSize: '12px',
      color: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
      border: '1px solid rgba(255,255,255,0.2)',
      transition: 'all 0.3s ease'
    }}>
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 5px ${color}`,
        animation: 'pulse 1s infinite'
      }} />
      <span>{label}</span>
      
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.5; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
          100% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  );
};

export default DebugIndicator;
