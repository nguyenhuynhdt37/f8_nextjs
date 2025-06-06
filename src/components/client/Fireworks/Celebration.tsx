'use client';
import React, { useEffect, useState } from 'react';
import styles from './Celebration.module.css';

interface CelebrationProps {
    show: boolean;
    duration?: number;
    onComplete?: () => void;
}

const Celebration: React.FC<CelebrationProps> = ({
    show,
    duration = 5000,
    onComplete
}) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [sparkles, setSparkles] = useState<{ id: number, x: number, y: number }[]>([]);

    // Tạo hiệu ứng lấp lánh ngẫu nhiên
    useEffect(() => {
        if (show) {
            console.log('Celebration component activated');

            // Hiển thị lớp overlay
            setShowOverlay(true);

            // Tạo các điểm lấp lánh
            const newSparkles = Array.from({ length: 30 }, (_, i) => ({
                id: i,
                x: Math.random() * 100, // vị trí % theo chiều ngang
                y: Math.random() * 100, // vị trí % theo chiều dọc
            }));

            setSparkles(newSparkles);

            // Đặt hẹn giờ để ẩn hiệu ứng
            const timer = setTimeout(() => {
                setShowOverlay(false);
                setSparkles([]);

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
        <>
            <div className={`${styles.celebrationOverlay} ${showOverlay ? styles.visible : ''}`}>
                {sparkles.map((sparkle) => (
                    <div
                        key={sparkle.id}
                        className={styles.sparkle}
                        style={{
                            left: `${sparkle.x}%`,
                            top: `${sparkle.y}%`,
                            animationDelay: `${Math.random() * 2}s`,
                        }}
                    />
                ))}
            </div>

            {/* Debug indicator */}
            <div className={styles.debugIndicator}>
                <div className={`${styles.debugDot} ${styles.dot1}`}></div>
                <div className={`${styles.debugDot} ${styles.dot2}`}></div>
                <div className={`${styles.debugDot} ${styles.dot3}`}></div>
            </div>
        </>
    );
};

export default Celebration;
