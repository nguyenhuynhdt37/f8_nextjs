'use client';
import React, { useEffect, useState } from 'react';

interface CustomFireworksProps {
    show: boolean;
    duration?: number;
    onComplete?: () => void;
}

const CustomFireworks: React.FC<CustomFireworksProps> = ({
    show,
    duration = 5000,
    onComplete
}) => {
    const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number }>>([]);

    useEffect(() => {
        if (show) {
            console.log('CustomFireworks shown');

            // Tạo các hạt pháo hoa
            const newParticles = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight * 0.7,
            }));

            setParticles(newParticles);

            const timer = setTimeout(() => {
                setParticles([]);
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
            pointerEvents: 'none',
            zIndex: 99999,
            overflow: 'hidden'
        }}>
            {particles.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.x}px`,
                        top: `${p.y}px`,
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        boxShadow: `0 0 10px 5px rgba(${Math.random() * 155 + 100}, ${Math.random() * 155 + 100}, ${Math.random() * 155}, 1)`,
                        animation: `explode ${Math.random() * 1 + 1}s ease-out infinite`,
                        animationDelay: `${Math.random() * 3}s`
                    }}
                />
            ))}            {/* Style inline để đảm bảo animation hoạt động */}
            <style jsx>{`
        @keyframes explode {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>

            {/* Đèn hiệu để xác nhận component đang hiển thị */}
            <div style={{
                position: 'fixed',
                bottom: '50px',
                right: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '10px',
                fontSize: '10px',
                color: 'white',
                zIndex: 100000,
            }}>
                <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#00ff00',
                    boxShadow: '0 0 5px #00ff00',
                }} />
                <span>Custom Fireworks</span>
            </div>
        </div>
    );
};

export default CustomFireworks;
