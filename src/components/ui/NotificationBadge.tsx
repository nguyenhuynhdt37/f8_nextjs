'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';

interface NotificationBadgeProps {
    count?: number;
    maxCount?: number;
    animate?: boolean;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
    count = 0,
    maxCount = 99,
    animate = true
}) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (count > 0) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    }, [count]);

    const displayCount = count > maxCount ? `${maxCount}+` : count;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={animate ? { scale: 0 } : { scale: 1 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className={`absolute ${count > 9 ? '-top-3 -right-3' : 'top-0 right-0'} flex items-center justify-center ${count > 9 ? 'min-w-[22px] h-[22px]' : 'w-[12px] h-[12px]'} bg-red-500 rounded-full`}
                >
                    {count > 9 && (
                        <span className="text-xs text-white font-medium px-1">
                            {displayCount}
                        </span>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default NotificationBadge;
