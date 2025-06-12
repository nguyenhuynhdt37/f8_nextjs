'use client';
import { useAppDispatch } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getLearningPathById } from '@/api/axios/api';
import { motion } from 'framer-motion';

interface Step {
    id: number;
    title: string;
    description: string;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
    courses: any[];
}

interface LearningPath {
    id: number;
    title: string;
    description: string;
    image: string;
    level: string;
    estimatedTime: number;
    createdAt: string;
    updatedAt: string;
    status: number;
    totalSteps: number;
    totalCourses: number;
}

const LearningPathDetailClient = ({ pathId, initialData }: { pathId: string, initialData?: any }) => {
    const dispatch = useAppDispatch();
    const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
    const [steps, setSteps] = useState<Step[]>([]);
    const [activeStep, setActiveStep] = useState<number | null>(null);
    const [expandedSteps, setExpandedSteps] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        dispatch(setStateNav(2));
        const fetchLearningPathDetail = async () => {
            try {
                // If initialData is provided, use it
                if (initialData?.statusCode === 200 && initialData?.data) {
                    processData(initialData.data);
                } else {
                    // Otherwise fetch from API
                    const data = await getLearningPathById(Number(pathId));
                    if (data?.statusCode === 200 && data?.data) {
                        processData(data.data);
                    } else {
                        throw new Error(data?.message || 'Không tìm thấy thông tin lộ trình');
                    }
                }
            } catch (error) {
                console.error('Lỗi khi tải thông tin lộ trình:', error);
                setError('Không thể tải dữ liệu lộ trình học. Vui lòng thử lại sau.');
            } finally {
            }
        };

        // Process the data from API or initialData
        const processData = (data: any) => {
            setLearningPath(data.learningPath);
            setSteps(data.steps || []);

            // Expand first step by default if available
            if (data.steps?.length > 0) {
                setExpandedSteps([data.steps[0].id]);
                setActiveStep(data.steps[0].id);
            }
        };

        fetchLearningPathDetail();
    }, [dispatch, initialData, pathId]);

    const toggleStep = (stepId: number) => {
        setActiveStep(stepId);
        if (expandedSteps.includes(stepId)) {
            setExpandedSteps(expandedSteps.filter(id => id !== stepId));
        } else {
            setExpandedSteps([...expandedSteps, stepId]);
        }
    };

    const getLevelLabel = (level: string): string => {
        switch (level?.toLowerCase()) {
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
        switch (level?.toLowerCase()) {
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Đã xảy ra lỗi</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors"
                    >
                        Thử lại
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">Không tìm thấy dữ liệu</h2>
                    <p className="text-gray-600 mb-6">Không thể tìm thấy lộ trình học bạn yêu cầu.</p>
                    <Link
                        href="/learning-paths"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-lg transition-colors inline-block"
                    >
                        Xem các lộ trình khác
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
                            <div className="flex items-center mb-4">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(learningPath.level)} mr-3`}>
                                    {getLevelLabel(learningPath.level)}
                                </span>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-yellow-300 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                    <span className="text-yellow-300 text-sm font-medium">Được đề xuất</span>
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">{learningPath.title}</h1>
                            <p className="text-lg md:text-xl opacity-90 mb-6 line-clamp-3">{learningPath.description.split('\n')[0]}</p>
                            <div className="flex flex-wrap gap-4 mb-6">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                                    {learningPath.totalSteps} bước học
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                                    {learningPath.totalCourses || 0} khóa học
                                </div>
                                <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                        </svg>
                                        {learningPath.estimatedTime} giờ
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <button className="bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                                    Bắt đầu học
                                </button>
                                <a href="#content" className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                    Xem nội dung
                                </a>
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
            <div id="content" className="container mx-auto px-4 py-12 max-w-6xl">
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
                                                        {step.orderIndex}
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
                                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg p-6 text-center">
                                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Chưa có nội dung</h3>
                                    <p className="text-gray-500 dark:text-gray-400">Nội dung lộ trình đang được cập nhật. Vui lòng quay lại sau.</p>
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
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Thông tin lộ trình</h3>

                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mr-4">
                                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Trình độ</p>
                                        <p className="font-medium text-gray-800 dark:text-white">{getLevelLabel(learningPath.level)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Thời gian hoàn thành</p>
                                        <p className="font-medium text-gray-800 dark:text-white">{learningPath.estimatedTime} giờ</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mr-4">
                                        <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Số bước</p>
                                        <p className="font-medium text-gray-800 dark:text-white">{steps.length} bước học</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Số khóa học</p>
                                        <p className="font-medium text-gray-800 dark:text-white">{learningPath.totalCourses || 0} khóa học</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-medium transition-colors">
                                    Đăng ký học
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LearningPathDetailClient;
