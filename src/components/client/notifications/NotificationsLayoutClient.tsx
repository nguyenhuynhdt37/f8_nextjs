'use client';

import React from 'react';
import { AnimatePresence, motion } from '@/lib/motion';
import { FaBell } from 'react-icons/fa';

export default function NotificationsLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
            >
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                    <div className="container mx-auto py-12 px-4 max-w-4xl">
                        <div className="flex items-center mb-4">
                            <div className="bg-white/20 p-4 rounded-full mr-5">
                                <FaBell className="text-3xl" />
                            </div>
                            <h1 className="text-4xl font-bold">Thông báo</h1>
                        </div>
                        <p className="text-blue-100 max-w-xl text-xl">
                            Theo dõi các cập nhật mới nhất về khóa học, bình luận và hoạt động của bạn trên nền tảng F8.
                        </p>
                    </div>
                </div>
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
