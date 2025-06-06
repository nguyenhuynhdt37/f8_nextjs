'use client';

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';

interface FadeAnimationProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    className?: string;
}

const FadeAnimation = ({
    children,
    delay = 0,
    duration = 0.5,
    className = ''
}: FadeAnimationProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
                duration: duration,
                delay: delay,
                ease: "easeOut"
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface SlideAnimationProps {
    children: ReactNode;
    direction?: 'left' | 'right' | 'up' | 'down';
    delay?: number;
    duration?: number;
    className?: string;
}

const SlideAnimation = ({
    children,
    direction = 'up',
    delay = 0,
    duration = 0.5,
    className = ''
}: SlideAnimationProps) => {
    const getDirectionValues = () => {
        switch (direction) {
            case 'left':
                return { initial: { x: 50 }, animate: { x: 0 } };
            case 'right':
                return { initial: { x: -50 }, animate: { x: 0 } };
            case 'up':
                return { initial: { y: 50 }, animate: { y: 0 } };
            case 'down':
                return { initial: { y: -50 }, animate: { y: 0 } };
            default:
                return { initial: { y: 50 }, animate: { y: 0 } };
        }
    };

    const { initial, animate } = getDirectionValues();

    return (
        <motion.div
            initial={{ opacity: 0, ...initial }}
            animate={{ opacity: 1, ...animate }}
            exit={{ opacity: 0, ...initial }}
            transition={{
                duration: duration,
                delay: delay,
                ease: "easeOut"
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface StaggerAnimationProps {
    children: ReactNode[];
    staggerDelay?: number;
    duration?: number;
    className?: string;
    childClassName?: string;
}

const StaggerAnimation = ({
    children,
    staggerDelay = 0.1,
    duration = 0.5,
    className = '',
    childClassName = ''
}: StaggerAnimationProps) => {
    return (
        <motion.div className={className}>
            <AnimatePresence>
                {React.Children.map(children, (child, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{
                            duration: duration,
                            delay: index * staggerDelay,
                            ease: "easeOut"
                        }}
                        className={childClassName}
                    >
                        {child}
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

interface PulseAnimationProps {
    children: ReactNode;
    scale?: number;
    duration?: number;
    className?: string;
}

const PulseAnimation = ({
    children,
    scale = 1.05,
    duration = 1.5,
    className = ''
}: PulseAnimationProps) => {
    return (
        <motion.div
            animate={{
                scale: [1, scale, 1],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "easeInOut"
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface AnimateButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
    hoverScale?: number;
    tapScale?: number;
}

const AnimateButton = ({
    children,
    onClick,
    className = '',
    disabled = false,
    type = "button",
    hoverScale = 1.03,
    tapScale = 0.97
}: AnimateButtonProps) => {
    return (
        <motion.button
            whileHover={!disabled ? { scale: hoverScale } : undefined}
            whileTap={!disabled ? { scale: tapScale } : undefined}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            onClick={onClick}
            disabled={disabled}
            type={type}
            className={`${className} ${disabled ? 'cursor-not-allowed opacity-70' : ''}`}
        >
            {children}
        </motion.button>
    );
};

export {
    FadeAnimation,
    SlideAnimation,
    StaggerAnimation,
    PulseAnimation,
    AnimateButton
};
