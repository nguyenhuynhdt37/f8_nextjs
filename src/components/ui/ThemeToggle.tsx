'use client';

import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { motion, AnimatePresence } from '@/lib/motion';
import { useTheme } from '@/context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Đảm bảo component chỉ render ở client-side để tránh hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Tránh hydration mismatch
    if (!mounted) return null;

    return (
        <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{
                scale: 1.1,
                boxShadow: theme === 'light'
                    ? '0 0 8px rgba(79, 70, 229, 0.6)'
                    : '0 0 8px rgba(129, 140, 248, 0.6)'
            }}
            onClick={toggleTheme}
            className="relative p-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 text-indigo-600 dark:text-indigo-300 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-800 dark:hover:to-purple-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 overflow-hidden"
            aria-label={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
        >
            <div className="absolute inset-0 overflow-hidden opacity-30">
                <div className={`absolute ${theme === 'light' ? 'top-0 left-0' : 'bottom-0 right-0'} w-8 h-8 rounded-full bg-indigo-400 dark:bg-indigo-600 blur-md`}></div>
            </div>

            <AnimatePresence mode="wait">
                {theme === 'light' ? (
                    <motion.div
                        key="moon"
                        initial={{ rotate: -45, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 45, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FiMoon className="w-5 h-5" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="sun"
                        initial={{ rotate: 45, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -45, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <FiSun className="w-5 h-5" />
                    </motion.div>
                )}
            </AnimatePresence>

            <span className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
        </motion.button>
    );
};

export default ThemeToggle; 