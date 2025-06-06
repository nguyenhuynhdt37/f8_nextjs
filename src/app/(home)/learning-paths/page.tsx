'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import learningPathApi from '@/api/axios/learningPathApi';
import { FiClock, FiBook, FiLayers } from 'react-icons/fi';
import type { Metadata } from 'next';

// export const metadata: Metadata = {
//     title: 'Lộ trình học lập trình | F8 - Học lập trình để đi làm',
//     description: 'Lựa chọn lộ trình học lập trình phù hợp với mục tiêu của bạn. F8 cung cấp các lộ trình học được thiết kế bởi chuyên gia với nội dung chất lượng, giúp bạn thành thạo kỹ năng và đạt được mục tiêu nghề nghiệp.',
//     keywords: 'lộ trình học lập trình, học lập trình, f8, front-end, back-end, fullstack, lộ trình học lập trình hiệu quả, khóa học lập trình, học lập trình online',
//     openGraph: {
//         title: 'Lộ trình học lập trình | F8 - Học lập trình để đi làm',
//         description: 'Lựa chọn lộ trình học lập trình phù hợp với mục tiêu của bạn tại F8. Các lộ trình được thiết kế bởi chuyên gia giúp bạn thành thạo kỹ năng và đạt được mục tiêu nghề nghiệp.',
//         images: ['https://fullstack.edu.vn/assets/images/learning-paths-thumb.png'],
//         type: 'website',
//         siteName: 'F8 - Học lập trình để đi làm',
//     },
//     twitter: {
//         card: 'summary_large_image',
//         title: 'Lộ trình học lập trình | F8 - Học lập trình để đi làm',
//         description: 'Lựa chọn lộ trình học lập trình phù hợp với mục tiêu của bạn tại F8.',
//         images: ['https://fullstack.edu.vn/assets/images/learning-paths-thumb.png'],
//     },
//     alternates: {
//         canonical: 'https://fullstack.edu.vn/learning-paths',
//     },
// };

interface LearningPath {
    id: number;
    title: string;
    description?: string;
    image?: string;
    level?: string;
    estimatedTime?: number;
    totalSteps: number;
    totalCourses: number;
    status?: number;
}

export default function LearningPathsPage() {
    const [learningPaths, setLearningPaths] = useState<LearningPath[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLearningPaths = async () => {
            try {
                setLoading(true);
                const response = await learningPathApi.getAllLearningPaths();

                if (response.data.statusCode === 200) {
                    // Filter only active learning paths
                    const activePaths = response.data.data.filter((path: LearningPath) => path.status === 1);
                    setLearningPaths(activePaths);
                } else {
                    setError('Failed to fetch learning paths');
                }
            } catch (error) {
                console.error('Error fetching learning paths:', error);
                setError('An error occurred while fetching learning paths');
            } finally {
                setLoading(false);
            }
        };

        fetchLearningPaths();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Learning Paths</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Follow structured learning paths to master new skills from beginner to advanced level
                </p>
            </div>

            {learningPaths.length === 0 ? (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No learning paths available at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {learningPaths.map((path) => (
                        <Link href={`/learning-paths/${path.id}`} key={path.id}>
                            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1 h-full flex flex-col">
                                {path.image ? (
                                    <div className="h-48 overflow-hidden">
                                        <img
                                            src={path.image}
                                            alt={path.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <span className="text-white text-2xl font-bold">{path.title}</span>
                                    </div>
                                )}

                                <div className="p-6 flex-grow">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{path.title}</h2>

                                    {path.description && (
                                        <p className="text-gray-600 mb-4 line-clamp-2">{path.description}</p>
                                    )}

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {path.level && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {path.level}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 px-6 py-4">
                                    <div className="flex justify-between text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <FiLayers className="mr-1" />
                                            <span>{path.totalSteps} steps</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiBook className="mr-1" />
                                            <span>{path.totalCourses} courses</span>
                                        </div>
                                        {path.estimatedTime && (
                                            <div className="flex items-center">
                                                <FiClock className="mr-1" />
                                                <span>{path.estimatedTime} min</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}