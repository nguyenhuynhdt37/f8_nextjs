'use client';
import React, { useEffect, useState } from 'react';

/**
 * Component hiển thị hiệu ứng pháo hoa đơn giản
 */
const BasicFireworks: React.FC<{ show: boolean; duration?: number; onComplete?: () => void }> = ({
    show,
    duration = 5000,
    onComplete
}) => {
    const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number, color: string, size: number }>>([]);

    useEffect(() => {
        if (!show) return;

        console.log("BasicFireworks showing");

        // Tạo 100 hạt pháo hoa
        const newParticles = Array.from({ length: 100 }, (_, i) => ({
            id: i,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            size: Math.random() * 6 + 2
        }));

        setParticles(newParticles);

        // Dừng hiệu ứng sau khoảng thời gian duration
        const timer = setTimeout(() => {
            setParticles([]);
            if (onComplete) onComplete();
        }, duration);

        return () => clearTimeout(timer);
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
            {particles.map(p => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: p.x,
                        top: p.y,
                        width: p.size,
                        height: p.size,
                        borderRadius: '50%',
                        backgroundColor: p.color,
                        boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                        animation: 'firework-particle 1s ease-out infinite',
                    }}
                />
            ))}
            <style jsx global>{`
                @keyframes firework-particle {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(0);
                        opacity: 0;
                    }
                }
            `}</style>

            {/* Đèn hiệu debug */}
            <div style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'red',
                zIndex: 100000,
                border: '2px solid white',
            }} />
        </div>
    );
};

export default BasicFireworks;
