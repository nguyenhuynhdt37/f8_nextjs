'use client';

import React, { useEffect, useState } from 'react';
import { FaFire } from 'react-icons/fa';
import { motion } from '@/lib/motion';
import { useFireContext } from './FireProvider';

interface FireParticle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
    color: string;
}

interface FireTrail {
    id: number;
    x: number;
    y: number;
    particles: {
        id: number;
        xOffset: number;
        yOffset: number;
        size: number;
        opacity: number;
        color: string;
    }[];
}

const FireEffects = () => {
    const [particles, setParticles] = useState<FireParticle[]>([]);
    const [mouseTrail, setMouseTrail] = useState<FireTrail | null>(null);
    const [trailEnabled, setTrailEnabled] = useState(false);
    const { isFireEnabled } = useFireContext();

    // Handle mouse trail effect
    useEffect(() => {
        if (!isFireEnabled) return;

        let trailTimeout: NodeJS.Timeout;

        const handleMouseMove = (e: MouseEvent) => {
            if (!trailEnabled) {
                setTrailEnabled(true);
            }

            clearTimeout(trailTimeout);
            trailTimeout = setTimeout(() => {
                setTrailEnabled(false);
                setMouseTrail(null);
            }, 2000);

            const trailParticles = [];
            for (let i = 0; i < 5; i++) {
                trailParticles.push({
                    id: i,
                    xOffset: (Math.random() - 0.5) * 30,
                    yOffset: (Math.random() - 0.5) * 30,
                    size: Math.random() * 15 + 5,
                    opacity: Math.random() * 0.7 + 0.3,
                    color: ['#FFA500', '#FF4500', '#FF6347'][Math.floor(Math.random() * 3)]
                });
            }

            setMouseTrail({
                id: Date.now(),
                x: e.clientX,
                y: e.clientY,
                particles: trailParticles
            });
        };

        // Add debounced mousemove listener
        let timeout: NodeJS.Timeout;

        const debouncedMouseMove = (e: MouseEvent) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => handleMouseMove(e), 50);
        };

        window.addEventListener('mousemove', debouncedMouseMove);

        return () => {
            window.removeEventListener('mousemove', debouncedMouseMove);
            clearTimeout(timeout);
            clearTimeout(trailTimeout);
        };
    }, [isFireEnabled, trailEnabled]);

    // Create corner fire effects
    useEffect(() => {
        if (!isFireEnabled) {
            setParticles([]);
            return;
        }

        // Create initial fire particles
        const initialParticles: FireParticle[] = [];

        // Bottom right corner
        for (let i = 0; i < 5; i++) {
            initialParticles.push({
                id: i,
                x: window.innerWidth - Math.random() * 100 - 50,
                y: window.innerHeight - Math.random() * 100 - 50,
                size: Math.random() * 25 + 15,
                opacity: Math.random() * 0.7 + 0.3,
                speed: Math.random() * 2 + 1,
                color: ['#FFA500', '#FF4500', '#FF6347'][Math.floor(Math.random() * 3)]
            });
        }

        // Bottom left corner
        for (let i = 5; i < 10; i++) {
            initialParticles.push({
                id: i,
                x: Math.random() * 100 + 50,
                y: window.innerHeight - Math.random() * 100 - 50,
                size: Math.random() * 25 + 15,
                opacity: Math.random() * 0.7 + 0.3,
                speed: Math.random() * 2 + 1,
                color: ['#FFA500', '#FF4500', '#FF6347'][Math.floor(Math.random() * 3)]
            });
        }

        // Top edge particles
        for (let i = 10; i < 15; i++) {
            initialParticles.push({
                id: i,
                x: Math.random() * window.innerWidth,
                y: -20 - Math.random() * 50,
                size: Math.random() * 15 + 10,
                opacity: Math.random() * 0.5 + 0.2,
                speed: Math.random() * 1 + 0.5,
                color: ['#FFA500', '#FF4500', '#FF6347'][Math.floor(Math.random() * 3)]
            });
        }

        setParticles(initialParticles);

        // Animation loop
        const animateParticles = () => {
            setParticles(prevParticles =>
                prevParticles.map(particle => {
                    if (particle.id < 10) {
                        // Corner particles - move upward
                        const y = particle.y - particle.speed;

                        // Reset particles when they go off screen
                        if (y < -particle.size) {
                            if (particle.id < 5) {
                                // Right corner
                                return {
                                    ...particle,
                                    y: window.innerHeight,
                                    x: window.innerWidth - Math.random() * 100 - 50,
                                    opacity: Math.random() * 0.7 + 0.3,
                                    size: Math.random() * 25 + 15,
                                    speed: Math.random() * 2 + 1
                                };
                            } else {
                                // Left corner
                                return {
                                    ...particle,
                                    y: window.innerHeight,
                                    x: Math.random() * 100 + 50,
                                    opacity: Math.random() * 0.7 + 0.3,
                                    size: Math.random() * 25 + 15,
                                    speed: Math.random() * 2 + 1
                                };
                            }
                        }

                        return { ...particle, y };
                    } else {
                        // Top edge particles - move downward
                        const y = particle.y + particle.speed;

                        // Reset when they reach the bottom
                        if (y > window.innerHeight + particle.size) {
                            return {
                                ...particle,
                                y: -20 - Math.random() * 50,
                                x: Math.random() * window.innerWidth,
                                opacity: Math.random() * 0.5 + 0.2,
                                size: Math.random() * 15 + 10,
                                speed: Math.random() * 1 + 0.5
                            };
                        }

                        return { ...particle, y };
                    }
                })
            );
        };

        const interval = setInterval(animateParticles, 50);

        return () => clearInterval(interval);
    }, [isFireEnabled]);

    if (!isFireEnabled) return null;

    return (
        <div className="fire-effects fixed w-full h-full pointer-events-none overflow-hidden z-50">
            {/* Static fire particles */}
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="absolute"
                    style={{
                        left: `${particle.x}px`,
                        top: `${particle.y}px`,
                        opacity: particle.opacity,
                    }}
                >
                    <motion.div
                        animate={particle.id >= 10 ? {
                            y: [0, 5, 0],
                            rotate: [-5, 5, -5],
                            scale: [1, 0.9, 1]
                        } : {
                            y: [0, -5, 0],
                            rotate: [-5, 5, -5],
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            duration: 1.5 + Math.random(),
                            repeat: Infinity,
                            repeatType: "reverse"
                        }}
                    >
                        <FaFire
                            style={{
                                color: particle.color,
                                fontSize: `${particle.size}px`,
                                filter: 'blur(2px)',
                            }}
                        />
                    </motion.div>
                </div>
            ))}

            {/* Mouse trail effect */}
            {mouseTrail && trailEnabled && (
                <div className="absolute" style={{ left: mouseTrail.x, top: mouseTrail.y }}>
                    {mouseTrail.particles.map(particle => (
                        <motion.div
                            key={particle.id}
                            className="absolute"
                            initial={{
                                x: 0,
                                y: 0,
                                opacity: particle.opacity,
                                scale: 1
                            }}
                            animate={{
                                x: particle.xOffset * 2,
                                y: particle.yOffset * 3 - 20,
                                opacity: 0,
                                scale: 0.5
                            }}
                            transition={{
                                duration: 1,
                                ease: "easeOut"
                            }}
                            style={{
                                left: particle.xOffset,
                                top: particle.yOffset,
                            }}
                        >
                            <FaFire
                                style={{
                                    color: particle.color,
                                    fontSize: `${particle.size}px`
                                }}
                            />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Fixed corner flames */}
            <div className="fixed bottom-5 right-5">
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.2, 1],
                        rotate: [-5, 5, -5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                >
                    <FaFire className="text-[40px] text-orange-500" />
                </motion.div>
            </div>

            <div className="fixed bottom-5 left-5">
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        scale: [1, 1.2, 1],
                        rotate: [5, -5, 5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse",
                        delay: 0.5
                    }}
                >
                    <FaFire className="text-[40px] text-orange-500" />
                </motion.div>
            </div>
        </div>
    );
};


export default FireEffects;
