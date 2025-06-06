'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import learningPathApi from '@/api/axios/learningPathApi';
import { FiClock, FiBook, FiLayers, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import LearningPathDetailClient from '@/components/client/learning-paths/LearningPathDetailClient';
import { getLearningPathById } from '@/api/featch/learing-path';

interface Course {
    id: number;
    title: string;
    description?: string;
    banner?: string;
    level?: string;
    orderIndex: number;
}

interface Step {
    id: number;
    title: string;
    description?: string;
    orderIndex: number;
    courses: Course[];
    createdAt?: string;
    updatedAt?: string;
}

interface LearningPath {
    id: number;
    title: string;
    description?: string;
    image?: string;
    level?: string;
    estimatedTime?: number;
    createdAt?: string;
    updatedAt?: string;
    status?: number;
    totalSteps: number;
    totalCourses: number;
}

interface LearningPathDetail {
    learningPath: LearningPath;
    steps: Step[];
}

// export async function generateMetadata(): Promise<Metadata> {
//     return {
//         title: 'Lộ trình học tập | F8',
//         description: 'Khám phá lộ trình học tập trên F8'
//     };
// }

export default function LearningPathDetailPage() {
    const params = useParams();
    const slug = params.slug as string;

    // Extract learning path ID from slug
    let pathId: number;

    if (/^\d+$/.test(slug)) {
        pathId = Number(slug);
    } else {
        // Extract ID from the end of the slug (after the last dash)
        const idMatch = slug.match(/-(\d+)$/);
        pathId = idMatch ? Number(idMatch[1]) : 0;
    }

    const [learningPath, setLearningPath] = useState<LearningPathDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLearningPath = async () => {
            if (!pathId) {
                setError('Invalid learning path ID');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await learningPathApi.getLearningPathById(pathId);

                if (response.data.statusCode === 200) {
                    setLearningPath(response.data.data);
                } else {
                    setError('Failed to fetch learning path');
                }
            } catch (error) {
                console.error('Error fetching learning path:', error);
                setError('An error occurred while fetching the learning path');
            } finally {
                setLoading(false);
            }
        };

        fetchLearningPath();
    }, [pathId]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            </div>
        );
    }

    if (error || !learningPath) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error || 'Learning path not found'}</span>
                </div>
            </div>
        );
    }

    const { learningPath: path, steps } = learningPath;

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
                <Link href="/learning-paths" className="hover:text-indigo-600">
                    Learning Paths
                </Link>
                <FiChevronRight className="mx-2" />
                <span className="text-gray-700">{path.title}</span>
            </div>

            {/* Header */}
            <div className="mb-12">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-2/3">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">{path.title}</h1>
                        {path.description && (
                            <p className="text-lg text-gray-600 mb-6">{path.description}</p>
                        )}

                        <div className="flex flex-wrap gap-4 mb-6">
                            {path.level && (
                                <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                                    <span>Level: {path.level}</span>
                                </div>
                            )}

                            {path.estimatedTime && (
                                <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                                    <FiClock className="mr-1" />
                                    <span>{path.estimatedTime} minutes</span>
                                </div>
                            )}

                            <div className="flex items-center bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm">
                                <FiLayers className="mr-1" />
                                <span>{path.totalSteps} steps</span>
                            </div>

                            <div className="flex items-center bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm">
                                <FiBook className="mr-1" />
                                <span>{path.totalCourses} courses</span>
                            </div>
                        </div>
                    </div>

                    {path.image && (
                        <div className="md:w-1/3">
                            <img
                                src={path.image}
                                alt={path.title}
                                className="w-full h-auto rounded-lg shadow-md"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                }}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Steps */}
            <div className="mb-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Learning Path Steps</h2>

                {steps.length === 0 ? (
                    <div className="text-center py-10 border-2 border-dashed border-gray-300 rounded-lg">
                        <p className="text-gray-500 text-lg">No steps available for this learning path yet.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <div key={step.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="bg-gray-50 p-4 border-b border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-800">
                                        Step {index + 1}: {step.title}
                                    </h3>
                                    {step.description && (
                                        <p className="text-gray-600 mt-2">{step.description}</p>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h4 className="text-md font-medium text-gray-700 mb-4">Courses in this step:</h4>

                                    {step.courses && step.courses.length > 0 ? (
                                        <div className="space-y-4">
                                            {step.courses.map((course) => (
                                                <Link href={`/courses/${course.id}`} key={course.id}>
                                                    <div className="flex items-start p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                        {course.banner && (
                                                            <div className="flex-shrink-0 mr-4">
                                                                <img
                                                                    src={course.banner}
                                                                    alt={course.title}
                                                                    className="w-16 h-16 object-cover rounded"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).src = '/images/placeholder.jpg';
                                                                    }}
                                                                />
                                                            </div>
                                                        )}

                                                        <div className="flex-grow">
                                                            <h5 className="font-medium text-gray-800">{course.title}</h5>
                                                            {course.description && (
                                                                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{course.description}</p>
                                                            )}
                                                            {course.level && (
                                                                <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                                                                    {course.level}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex-shrink-0 self-center ml-4">
                                                            <FiArrowRight className="text-indigo-500" />
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No courses available for this step yet.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
} 