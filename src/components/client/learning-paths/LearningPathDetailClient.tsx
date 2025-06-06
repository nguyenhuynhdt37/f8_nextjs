'use client';
import { useAppDispatch } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStudyScheduleDetailById } from '@/api/axios/api';
import { motion } from 'framer-motion';

const LearningPathDetailClient = ({ pathId, initialData }: { pathId: string, initialData?: any }) => {
    const dispatch = useAppDispatch();
    const [learningPath, setLearningPath] = useState<any>(null);
    const [steps, setSteps] = useState<any[]>([]);
    const [activeStep, setActiveStep] = useState<number | null>(null);
    const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(setStateNav(2));
        const fetchLearningPathDetail = async () => {
            try {
                setIsLoading(true);

                // If initialData is provided, use it
                if (initialData?.statusCode === 200 && initialData?.data) {
                    processData(initialData.data);
                } else {
                    // Otherwise fetch from API
                    const data = await getStudyScheduleDetailById(Number(pathId));
                    if (data?.statusCode === 200 && data?.data) {
                        processData(data.data);
                    } else {
                        throw new Error(data?.message || 'Failed to fetch learning path');
                    }
                }
            } catch (error) {
                console.error('Error fetching learning path detail:', error);
                setError('Failed to load learning path data. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        // Process the data from API or initialData
        const processData = (data: any) => {
            setLearningPath(data.learning_path);
            setSteps(data.steps || []);

            // Expand first step by default if available
            if (data.steps?.length > 0) {
                setExpandedSteps([data.steps[0].id]);
                setActiveStep(data.steps[0].id);
            }
        };

        fetchLearningPathDetail();
    }, [pathId, dispatch, initialData]);

    const toggleStep = (stepId: number) => {
        setActiveStep(stepId);
        if (expandedSteps.includes(stepId)) {
            setExpandedSteps(expandedSteps.filter(id => id !== stepId));
        } else {
            setExpandedSteps([...expandedSteps, stepId]);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Data</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!learningPath) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">No Data Found</h2>
                    <p className="text-gray-600 mb-6">The requested learning path could not be found.</p>
                    <Link
                        href="/learning-paths"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors inline-block"
                    >
                        Browse Learning Paths
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col md:flex-row gap-8 items-center"
                    >
                        <div className="md:w-2/3">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{learningPath.title}</h1>
                            <p className="text-lg md:text-xl opacity-90 mb-6 whitespace-pre-line">{learningPath.description}</p>
                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                                    {steps.length} bước học
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                                    {learningPath.course_count || 0} khóa học
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                                    {learningPath.total_students || 0} học viên
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                                    Bắt đầu học
                                </button>
                                <button className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                        <div className="md:w-1/3">
                            <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                <img
                                    src={learningPath.image || "/images/learning-path-default.jpg"}
                                    alt={learningPath.title}
                                    className="w-full h-auto rounded-xl"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Giới thiệu lộ trình</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="whitespace-pre-line text-gray-600 dark:text-gray-300">{learningPath.description}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Nội dung lộ trình</h2>

                            {steps.length > 0 ? (
                                <div className="space-y-4">
                                    {steps.map((step, index) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: 0.1 * index }}
                                            key={step.id}
                                            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                                        >
                                            <div
                                                className={`p-4 cursor-pointer flex justify-between items-center ${activeStep === step.id ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-white dark:bg-gray-800'}`}
                                                onClick={() => toggleStep(step.id)}
                                            >
                                                <div className="flex items-center">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${activeStep === step.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-lg text-gray-800 dark:text-white">{step.title}</h3>
                                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                                            {step.courses?.length || 0} khóa học
                                                        </p>
                                                    </div>
                                                </div>
                                                <svg
                                                    className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform ${expandedSteps.includes(step.id) ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>

                                            {expandedSteps.includes(step.id) && (
                                                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                                    <p className="text-gray-600 dark:text-gray-300 mb-4 whitespace-pre-line">{step.description}</p>

                                                    {step.courses && step.courses.length > 0 ? (
                                                        <div className="space-y-4">
                                                            {step.courses.map((course: any) => (
                                                                <Link href={`/courses/${course.id}`} key={course.id} className="block">
                                                                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-sm transition-all flex gap-4">
                                                                        <img
                                                                            src={course.banner || "/images/course-default.jpg"}
                                                                            alt={course.title}
                                                                            className="w-24 h-16 object-cover rounded"
                                                                        />
                                                                        <div>
                                                                            <h4 className="font-medium text-indigo-600 dark:text-indigo-400">{course.title}</h4>
                                                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{course.description}</p>
                                                                        </div>
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg p-4 text-center">
                                                            <svg className="w-12 h-12 text-blue-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                            </svg>
                                                            <p className="text-blue-700 dark:text-blue-300 font-medium mb-1">Khóa học đang được phát triển</p>
                                                            <p className="text-blue-600 dark:text-blue-400 text-sm">Các khóa học cho bước này sẽ sớm được cập nhật.</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">Chưa có nội dung</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Nội dung lộ trình đang được cập nhật.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sticky top-20">
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Thông tin lộ trình</h3>

                            <div className="space-y-4">
                                <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Số bước học:</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{steps.length}</span>
                                </div>

                                <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Số khóa học:</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{learningPath.course_count || 0}</span>
                                </div>

                                <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Thời lượng:</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{learningPath.duration || 0} phút</span>
                                </div>

                                <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Học viên:</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{learningPath.total_students || 0}</span>
                                </div>

                                <div className="flex justify-between pb-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-gray-600 dark:text-gray-400">Cập nhật:</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">
                                        {new Date(learningPath.updatedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-3">
                                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-3 font-medium transition-colors flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Bắt đầu học ngay
                                </button>

                                <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-4 py-3 font-medium transition-colors flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Xem thêm thông tin
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Sẵn sàng bắt đầu hành trình học tập?</h2>
                    <p className="text-lg md:text-xl mb-8 opacity-90">
                        Lộ trình học tập được thiết kế bởi các chuyên gia giúp bạn tiếp thu kiến thức hiệu quả nhất
                    </p>
                    <button className="bg-white text-indigo-700 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-50 transition-colors">
                        Đăng ký học ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LearningPathDetailClient;
