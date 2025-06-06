'use client';
import React, { useEffect, useState } from 'react';
import styles from './SimpleFireworks.module.css';

interface SimpleFireworksProps {
    show: boolean;
    duration?: number;
    onComplete?: () => void;
}

const SimpleFireworks: React.FC<SimpleFireworksProps> = ({
    show,
    duration = 5000,
    onComplete
}) => {
    const [particles, setParticles] = useState<Array<{ id: number, x: number, y: number }>>([]);

    useEffect(() => {
        if (show) {
            console.log('SimpleFireworks shown');

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
        <div className={styles.fireworksContainer} style={{
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
                    className={styles.firework}
                    style={{
                        left: `${p.x}px`,
                        top: `${p.y}px`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${Math.random() * 1 + 1}s`
                    }}
                />
            ))}

            {/* Đèn hiệu để xác nhận component đang hiển thị */}
            <div className={styles.debugIndicator} />
        </div>
    );
};

export default SimpleFireworks;
