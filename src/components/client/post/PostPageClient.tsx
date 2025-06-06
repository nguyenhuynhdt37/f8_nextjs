'use client';

import dynamic from 'next/dynamic';
import { useCookie } from '@/hook/useCookie';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PostList = dynamic(() => import('@/components/client/post/PostList'), {
    loading: () => (
        <div className="flex justify-center items-center min-h-screen">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-lg text-gray-600">Đang tải bài viết...</p>
            </div>
        </div>
    ),
    ssr: false
});

export default function PostPageClient() {
    const [types, setTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const cookieHeader = useCookie();

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/post/all/type`,
                    {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
                    },
                );

                if (!res.ok) {
                    throw new Error('Failed to fetch data');
                }

                const result = await res.json();
                setTypes(result?.data || []);
            } catch (error) {
                console.error('Error fetching post types:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [cookieHeader]);

    if (isLoading) {
        return (
            <motion.div
                className="flex justify-center items-center min-h-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-lg text-gray-600">Đang tải bài viết...</p>
                </div>
            </motion.div>
        );
    }

    return <PostList types={types} />;
} 