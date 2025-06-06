'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';

/**
 * A notification toast component that appears and disappears smoothly
 */
interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    onClose?: () => void;
    isVisible?: boolean;
}

const Toast = ({
    message,
    type = 'info',
    duration = 3000,
    position = 'top-right',
    onClose,
    isVisible = true,
}: ToastProps) => {
    const [visible, setVisible] = useState(isVisible);

    useEffect(() => {
        setVisible(isVisible);
    }, [isVisible]);

    useEffect(() => {
        if (visible && duration > 0) {
            const timer = setTimeout(() => {
                setVisible(false);
                if (onClose) onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [visible, duration, onClose]);

    const getPositionStyles = () => {
        switch (position) {
            case 'top-right':
                return 'top-4 right-4';
            case 'top-left':
                return 'top-4 left-4';
            case 'bottom-right':
                return 'bottom-4 right-4';
            case 'bottom-left':
                return 'bottom-4 left-4';
            case 'top-center':
                return 'top-4 left-1/2 transform -translate-x-1/2';
            case 'bottom-center':
                return 'bottom-4 left-1/2 transform -translate-x-1/2';
            default:
                return 'top-4 right-4';
        }
    };

    const getTypeStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-white';
            case 'info':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-blue-500 text-white';
        }
    };

    const variants = {
        hidden: {
            opacity: 0,
            y: position.includes('top') ? -20 : 20,
            x: position.includes('center') ? 0 : position.includes('left') ? -20 : 20,
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
        },
        exit: {
            opacity: 0,
            y: position.includes('top') ? -20 : 20,
            x: position.includes('center') ? 0 : position.includes('left') ? -20 : 20,
        },
    };

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className={`fixed ${getPositionStyles()} z-50 px-4 py-2 rounded-lg shadow-lg flex items-center min-w-[250px] max-w-sm ${getTypeStyles()}`}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={variants}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                    <div className="flex-1">{message}</div>
                    <button
                        className="ml-2 text-white p-1 hover:opacity-80 transition-opacity"
                        onClick={() => {
                            setVisible(false);
                            if (onClose) onClose();
                        }}
                    >
                        ×
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { Toast };
