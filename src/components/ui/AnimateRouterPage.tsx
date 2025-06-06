'use client';

import React, { ReactNode, useEffect } from 'react';
import { motion, useAnimation } from '@/lib/motion';
import { usePathname } from 'next/navigation';

/**
 * Container component for page transition animations
 * This component should be used at the root of each page
 */

const AnimateRouterPage = ({ children }: { children: ReactNode }) => {
    const controls = useAnimation();
    const pathname = usePathname();

    useEffect(() => {
        controls.set({ opacity: 0, y: 20 });
        controls.start({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
            }
        });
    }, [pathname, controls]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            className="w-full"
        >
            {children}
        </motion.div>
    );
};

export default AnimateRouterPage;
