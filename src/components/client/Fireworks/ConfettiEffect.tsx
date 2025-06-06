'use client';
import React, { useEffect, useRef } from 'react';
import ConfettiGenerator from 'confetti-js';

interface ConfettiEffectProps {
    show: boolean;
    duration?: number;
    onComplete?: () => void;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
    show,
    duration = 5000,
    onComplete
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const confettiInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (show && canvasRef.current) {
            console.log('ConfettiEffect shown');

            // Tạo các tùy chọn cho confetti
            const confettiSettings = {
                target: canvasRef.current,
                max: 150,
                size: 1.5,
                animate: true,
                props: ['circle', 'square', 'triangle', 'line'],
                colors: [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 255, 0], [255, 0, 255], [0, 255, 255]],
                clock: 25,
                rotate: true,
                start_from_edge: true,
                respawn: true
            };

            // Khởi tạo confetti
            confettiInstanceRef.current = new ConfettiGenerator(confettiSettings);
            confettiInstanceRef.current.render();

            // Dừng hiệu ứng sau khoảng thời gian duration
            const timer = setTimeout(() => {
                if (confettiInstanceRef.current) {
                    confettiInstanceRef.current.clear();
                }
                if (onComplete) {
                    onComplete();
                }
            }, duration);

            return () => {
                clearTimeout(timer);
                if (confettiInstanceRef.current) {
                    confettiInstanceRef.current.clear();
                }
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
            <canvas
                ref={canvasRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none'
                }}
            />

            {/* Đèn hiệu debug */}
            <div style={{
                position: 'fixed',
                bottom: '50px',
                right: '50px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'blue',
                zIndex: 100000,
                border: '3px solid white',
                boxShadow: '0 0 10px rgba(0, 0, 255, 0.8)'
            }} />
        </div>
    );
};

export default ConfettiEffect;
