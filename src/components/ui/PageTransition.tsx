'use client';

import { motion } from '@/lib/motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
}

const PageTransition = ({ children }: PageTransitionProps) => {
    const variants = {
        hidden: { opacity: 0, y: 20 },
        enter: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.33, 1, 0.68, 1],
                staggerChildren: 0.1
            }
        },
        exit: {
            opacity: 0,
            y: 20,
            transition: {
                duration: 0.3,
                ease: [0.33, 1, 0.68, 1]
            }
        },
    };

    return (
        <motion.div
            variants={variants}
            initial="hidden"
            animate="enter"
            exit="exit"
            className="min-h-screen"
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
