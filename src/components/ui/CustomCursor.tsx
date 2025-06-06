'use client';

import { useEffect, useState } from 'react';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseEnter = () => setVisible(true);
        const handleMouseLeave = () => setVisible(false);

        document.addEventListener('mousemove', updatePosition);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', updatePosition);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const cursorStyle = {
        transform: `translate(${position.x}px, ${position.y}px)`,
        opacity: visible ? 1 : 0,
    };

    return (
        <>
            <div
                className="cursor-dot fixed hidden md:block w-6 h-6 bg-white rounded-full opacity-50 pointer-events-none z-50 blur-sm transition-opacity duration-200"
                style={{
                    ...cursorStyle,
                    left: 0,
                    top: 0,
                    transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))`,
                    mixBlendMode: 'plus-lighter',
                }}
            />
            <div
                className="cursor-outline fixed hidden md:block w-10 h-10 border-2 border-white rounded-full opacity-30 pointer-events-none z-50 transition-opacity duration-200"
                style={{
                    ...cursorStyle,
                    left: 0,
                    top: 0,
                    transform: `translate(calc(${position.x}px - 50%), calc(${position.y}px - 50%))`,
                }}
            />
        </>
    );
} 