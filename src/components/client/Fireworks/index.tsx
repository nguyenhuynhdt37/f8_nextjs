'use client';
import React, { useEffect, useRef } from 'react';
import Fireworks from 'fireworks-js';

interface FireworksDisplayProps {
    show: boolean;
    duration?: number;
    onComplete?: () => void;
}

const FireworksDisplay: React.FC<FireworksDisplayProps> = ({
    show,
    duration = 5000,
    onComplete,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const fireworksInstanceRef = useRef<Fireworks | null>(null);

    useEffect(() => {
        console.log("FireworksDisplay - show value:", show);

        if (show && containerRef.current) {
            console.log("Initializing fireworks effect");
            try {
                // Xóa mọi instance cũ nếu có
                if (fireworksInstanceRef.current) {
                    fireworksInstanceRef.current.stop();
                    fireworksInstanceRef.current = null;
                }

                fireworksInstanceRef.current = new Fireworks(containerRef.current, {
                    autoresize: true,
                    opacity: 1,
                    acceleration: 1.05,
                    friction: 0.97,
                    gravity: 1.5,
                    particles: 150,  // Tăng số lượng hạt
                    traceLength: 3,
                    traceSpeed: 10,
                    explosion: 15,   // Tăng kích thước vụ nổ
                    intensity: 50,   // Tăng cường độ
                    flickering: 50,
                    lineStyle: 'round',
                    hue: {
                        min: 0,
                        max: 360
                    },
                    delay: {
                        min: 8,     // Giảm độ trễ tối thiểu giữa các vụ nổ
                        max: 15      // Giảm độ trễ tối đa giữa các vụ nổ
                    },
                    rocketsPoint: {
                        min: 10,
                        max: 90
                    },
                    brightness: {
                        min: 70,     // Tăng độ sáng tối thiểu
                        max: 100      // Tăng độ sáng tối đa
                    },
                    decay: {
                        min: 0.008,  // Giảm tốc độ biến mất tối thiểu
                        max: 0.015   // Giảm tốc độ biến mất tối đa
                    },
                    mouse: {
                        click: false,
                        move: false,
                        max: 1
                    }
                });

                fireworksInstanceRef.current.start();
                console.log("Fireworks started successfully!");

                // Phát âm thanh thành công
                try {
                    const audio = new Audio('/sounds/success.mp3');
                    audio.volume = 0.5;
                    audio.play().catch(error => {
                        console.warn('Không thể tự động phát âm thanh:', error);
                    });
                } catch (error) {
                    console.warn('Lỗi khi phát âm thanh:', error);
                }

                // Tự động dừng sau thời gian duration
                const timer = setTimeout(() => {
                    if (fireworksInstanceRef.current) {
                        fireworksInstanceRef.current.stop();
                        if (onComplete) {
                            onComplete();
                        }
                    }
                }, duration);

                return () => {
                    clearTimeout(timer);
                    if (fireworksInstanceRef.current) {
                        fireworksInstanceRef.current.stop();
                    }
                };
            } catch (error) {
                console.error("Lỗi khi khởi tạo hiệu ứng pháo hoa:", error);
            }
        }
    }, [show, duration, onComplete]);

    // Thêm một component hiển thị debug khi fireworks được kích hoạt
    if (!show) return null;

    return (
        <>
            <div
                ref={containerRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 99999, // Tăng z-index để đảm bảo nó hiển thị trên cùng
                    backgroundColor: 'transparent',
                    overflow: 'hidden',
                }}
            />
            {/* Thêm một đèn hiệu để hiển thị khi component được kích hoạt */}
            <div style={{
                position: 'fixed',
                bottom: '5px',
                right: '5px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: 'red',
                zIndex: 99999,
                border: '1px solid white',
            }} />
        </>
    );
};

export default FireworksDisplay;

