'use client';

import { AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimationProviderProps {
    children: ReactNode;
}

export default function AnimationProvider({ children }: AnimationProviderProps) {
    return <AnimatePresence mode="wait">{children}</AnimatePresence>;
}
