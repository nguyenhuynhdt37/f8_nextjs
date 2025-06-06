'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/admin/Header';
import Sidebar from '@/components/admin/Slidebar';
import { useTheme } from '@/context/ThemeContext';

export default function AdminLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    // Handle sidebar collapse state
    const handleSidebarToggle = (isCollapsed: boolean) => {
        setCollapsed(isCollapsed);
    };

    // Setting mounted state to true after the component is mounted
    useEffect(() => {
        setMounted(true);

        // Add CSS rules for modern design
        const style = document.createElement('style');
        style.id = 'admin-styles';
        style.innerHTML = `
            .admin-layout { 
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif;
                --primary-color: #3b82f6;
                --primary-hover: #2563eb;
                --primary-light: #dbeafe;
                --primary-dark: #1e40af;
                --success-color: #10b981;
                --warning-color: #f59e0b;
                --danger-color: #ef4444;
                --info-color: #06b6d4;
            }
            
            /* Glass morphism effects */
            .glass-card {
                background: rgba(255, 255, 255, 0.7);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
            }
            
            .dark .glass-card {
                background: rgba(30, 41, 59, 0.7);
                border: 1px solid rgba(255, 255, 255, 0.08);
            }
            
            /* Dashboard cards */
            .dashboard-card {
                border-radius: 12px;
                overflow: hidden;
                transition: all 0.3s ease;
            }
            
            .dashboard-card:hover {
                transform: translateY(-4px);
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
            }
            
            .dark .dashboard-card:hover {
                box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
            }
            
            /* Modern scrollbar */
            .modern-scrollbar::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            
            .modern-scrollbar::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .modern-scrollbar::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.2);
                border-radius: 6px;
            }
            
            .dark .modern-scrollbar::-webkit-scrollbar-thumb {
                background-color: rgba(255, 255, 255, 0.2);
            }
            
            .modern-scrollbar::-webkit-scrollbar-thumb:hover {
                background-color: var(--primary-color);
            }
            
            /* Form controls */
            .admin-layout input, .admin-layout select, .admin-layout textarea {
                border-radius: 8px;
                transition: all 0.2s ease;
            }
            
            .admin-layout input:focus, .admin-layout select:focus, .admin-layout textarea:focus {
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
                border-color: var(--primary-color);
            }
            
            /* Buttons */
            .admin-btn {
                border-radius: 8px;
                font-weight: 500;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0.5rem 1rem;
            }
            
            .admin-btn-primary {
                background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
                color: white;
                box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
            }
            
            .admin-btn-primary:hover {
                box-shadow: 0 6px 10px -1px rgba(59, 130, 246, 0.4);
                transform: translateY(-1px);
            }
            
            /* Tables */
            .admin-table {
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid rgba(0, 0, 0, 0.1);
            }
            
            .dark .admin-table {
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .admin-table th {
                background-color: rgba(243, 244, 246, 0.7);
                font-weight: 500;
                text-transform: uppercase;
                font-size: 0.75rem;
                letter-spacing: 0.05em;
            }
            
            .dark .admin-table th {
                background-color: rgba(30, 41, 59, 0.7);
            }
            
            .admin-table tr {
                transition: all 0.2s ease;
            }
            
            .admin-table tr:hover {
                background-color: rgba(243, 244, 246, 0.5);
            }
            
            .dark .admin-table tr:hover {
                background-color: rgba(30, 41, 59, 0.5);
            }
            
            /* Stats cards */
            .stat-card {
                border-radius: 12px;
                padding: 1.5rem;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .stat-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
                z-index: 0;
            }
            
            .stat-card .stat-icon {
                position: relative;
                z-index: 1;
                width: 48px;
                height: 48px;
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 1rem;
            }
            
            .stat-card .stat-content {
                position: relative;
                z-index: 1;
            }
            
            .stat-card .stat-value {
                font-size: 1.75rem;
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            
            .stat-card .stat-label {
                font-size: 0.875rem;
                color: rgba(107, 114, 128, 0.8);
            }
            
            .dark .stat-card .stat-label {
                color: rgba(209, 213, 219, 0.8);
            }
            
            /* Background patterns */
            .pattern-dots {
                background-image: radial-gradient(rgba(0, 0, 0, 0.1) 1px, transparent 1px);
                background-size: 20px 20px;
            }
            
            .dark .pattern-dots {
                background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px);
            }
            
            /* Gradient borders */
            .gradient-border {
                position: relative;
                border-radius: 12px;
                padding: 1px;
                background: linear-gradient(135deg, var(--primary-color), var(--info-color));
            }
            
            .gradient-border-content {
                border-radius: 11px;
                background-color: white;
                height: 100%;
            }
            
            .dark .gradient-border-content {
                background-color: #1e293b;
            }
        `;
        document.head.appendChild(style);

        return () => {
            const styleElement = document.getElementById('admin-styles');
            if (styleElement) {
                document.head.removeChild(styleElement);
            }
        };
    }, []);

    if (!mounted) {
        return null; // Prevent layout shift during hydration
    }

    return (
        <div className={`admin-layout ${isDark ? 'dark' : ''}`}>
            <div className={`flex h-screen ${isDark ? 'bg-slate-900' : 'bg-gray-50'} overflow-hidden pattern-dots`}>
                <Sidebar onToggle={handleSidebarToggle} />
                <motion.div
                    className={`flex flex-col flex-1 ${collapsed ? 'ml-16' : 'ml-64'} transition-all duration-300`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <Header collapsed={collapsed} />
                    <main className={`flex-1 overflow-y-auto p-6 mt-16 modern-scrollbar ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="content"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="max-w-7xl mx-auto"
                            >
                                <motion.div
                                    className="glass-card p-6 rounded-xl"
                                    whileHover={{
                                        boxShadow: isDark
                                            ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                                            : "0 8px 32px rgba(0, 0, 0, 0.1)",
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {children}
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </motion.div>
            </div>
        </div>
    );
}
