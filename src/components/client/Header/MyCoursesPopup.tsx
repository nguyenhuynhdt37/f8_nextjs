'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from '@/lib/motion';
import { getMyCoursesAsync } from '@/api/axios/api';

// Define course type
interface EnrolledCourse {
    enrollment: {
        id: number;
        enrolledAt: string;
        completionStatus: number | null;
    };
    course: {
        id: number;
        title: string;
        banner: string | null;
        introduce: string;
        level: string | null;
        levelId: number;
        price: number | null;
        isFree: boolean | null;
        isActive: boolean;
    };
}

const MyCoursesPopup = ({ onClose }: { onClose: () => void }) => {
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Call API to get user's enrolled courses (limit to 5)
                const response = await getMyCoursesAsync(1, 5, 'EnrolledAt', 'desc');
                if (response.statusCode === 200 && response.data) {
                    setCourses(response.data.courses);
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleViewAll = () => {
        router.push('/courses/my-courses');
        onClose();
    };

    const handleCourseContinue = (courseId: number) => {
        router.push(`/courses/${courseId}`);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[300px] sm:w-[350px] md:w-[400px] max-h-[450px] sm:max-h-[500px] overflow-hidden flex flex-col"
        >
            <div className="flex justify-between items-center border-b border-gray-200 p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold">Khóa học của tôi</h3>
                <button
                    onClick={handleViewAll}
                    className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm"
                >
                    Xem tất cả
                </button>
            </div>

            <div className="overflow-y-auto flex-grow">
                {loading ? (
                    <div className="p-8 flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : courses.length > 0 ? (
                    <div>
                        {courses.map((item) => (
                            <motion.div
                                key={item.enrollment.id}
                                whileHover={{ backgroundColor: '#f7f9fa dark:bg-gray-700/50' }}
                                onClick={() => handleCourseContinue(item.course.id)}
                                className="p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 dark:hover:bg-gray-700/50 cursor-pointer"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={item.course.banner || '/images/course-default.png'}
                                        alt={item.course.title}
                                        className="h-12 w-20 sm:h-16 sm:w-28 object-cover rounded-md mr-2 sm:mr-3"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.course.title}</h4>

                                        <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-blue-600 h-1.5 rounded-full"
                                                style={{ width: `${item.enrollment.completionStatus || 0}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {item.enrollment.completionStatus || 0}% hoàn thành
                                            </span>
                                            <span className="text-xs text-blue-600 font-medium">
                                                Tiếp tục
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 text-center">
                        <p className="text-sm text-gray-500">Bạn chưa đăng ký khóa học nào</p>
                        <button
                            onClick={() => router.push('/courses')}
                            className="mt-2 px-3 py-1.5 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600"
                        >
                            Khám phá khóa học
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MyCoursesPopup;
