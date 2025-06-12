'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLearningPaths } from '@/api/axios/api';
import { useAppDispatch } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import { motion } from 'framer-motion';

interface LearningPath {
    id: number;
    title: string;
    description: string;
    image: string;
    level: string;
    estimatedTime: number;
    status: number;
    totalSteps: number;
    totalCourses: number;
    createdAt: string;
    updatedAt: string;
}

interface LearningPathsProps {
    initialData: any;
}

const LearningPathsClient: React.FC<LearningPathsProps> = ({ initialData }) => {
    const dispatch = useAppDispatch();
    const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(setStateNav(2)); // Set active nav state for Learning Paths

        const fetchLearningPaths = async () => {
            try {
                if (initialData?.statusCode === 200 && initialData?.data) {
                    setLearningPaths(initialData.data);
                } else {
                    const response = await getLearningPaths();
                    if (response?.statusCode === 200 && response?.data) {
                        setLearningPaths(response.data);
                    } else {
                        throw new Error(response?.message || 'Không thể tải dữ liệu lộ trình');
                    }
                }
            } catch (err) {
                console.error('Lỗi khi tải dữ liệu lộ trình:', err);
                setError('Không thể tải dữ liệu lộ trình học. Vui lòng thử lại sau.');
            } finally {
            }
        };

        fetchLearningPaths();
    }, [dispatch, initialData]);

    const getLevelLabel = (level: string): string => {
        switch (level.toLowerCase()) {
            case 'beginner':
                return 'Cơ bản';
            case 'intermediate':
                return 'Trung cấp';
            case 'advanced':
                return 'Nâng cao';
            default:
                return 'Tất cả trình độ';
        }
    };

    const getLevelColor = (level: string): string => {
        switch (level.toLowerCase()) {
            case 'beginner':
                return 'bg-green-100 text-green-800';
            case 'intermediate':
                return 'bg-blue-100 text-blue-800';
            case 'advanced':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (error) {
        return (
            <div className="min-h-screen py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col justify-center items-center min-h-[60vh] text-center">
                        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Có lỗi xảy ra</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
                        <button
                            onClick={() => {
                                setError(null);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!learningPaths) {
        return (
            <div className="min-h-screen py-12 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col justify-center items-center min-h-[60vh] text-center">
                        <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">Chưa có lộ trình nào</h2>
                        <p className="text-gray-600 dark:text-gray-300">Các lộ trình học đang được phát triển và sẽ sớm được cập nhật.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="container mx-auto max-w-6xl">
                {/* Header section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                        Lộ trình học tập
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Để bắt đầu một cách thuận lợi, bạn nên tham gia khóa học theo lộ trình.
                        Các khóa học được thiết kế theo lộ trình từ cơ bản đến nâng cao phù hợp với mọi đối tượng.
                    </p>
                </motion.div>

                {/* Learning Paths Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {learningPaths.map((path, index) => (
                        <motion.div
                            key={path.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                        >
                            <div className="relative h-48 md:h-56 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                                {path.image ? (
                                    <img
                                        src={path.image}
                                        alt={path.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                                )}
                                <div className="absolute bottom-4 left-4 z-20">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(path.level)}`}>
                                        {getLevelLabel(path.level)}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
                                    {path.title}
                                </h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                                    {path.description.split('\n')[0]} {/* Only show first paragraph */}
                                </p>
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex space-x-4">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                            </svg>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{path.totalSteps} bước</span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                                            </svg>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{path.totalCourses} khóa học</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 text-gray-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">{path.estimatedTime} giờ</span>
                                    </div>
                                </div>
                                <Link
                                    href={`/learning-paths/${path.id}`}
                                    className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-3 rounded-lg font-medium transition-colors"
                                >
                                    Xem chi tiết
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LearningPathsClient; 