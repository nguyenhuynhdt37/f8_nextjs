'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from '@/lib/motion';

// Define course type
interface Course {
    id: string;
    title: string;
    progress: number;
    color: string;
    banner?: string;
    lastAccessed: string | null;
}

// Mock data for demonstration - would be replaced with actual API calls
const MOCK_COURSES: Course[] = [
    {
        id: '123',
        title: 'HTML CSS Pro',
        progress: 70,
        color: 'blue',
        banner: 'https://fullstack.edu.vn/landing/htmlcss/assets/img/meta-img.png',
        lastAccessed: '2023-05-15T10:30:00',
    },
    {
        id: '456',
        title: 'JavaScript Cơ Bản',
        progress: 45,
        color: 'green',
        banner: 'https://fullstack.edu.vn/landing/htmlcss/assets/img/js-course-bg.png',
        lastAccessed: '2023-05-10T14:20:00',
    },
    {
        id: '789',
        title: 'ReactJS Nâng Cao',
        progress: 25,
        color: 'red',
        banner: 'https://fullstack.edu.vn/landing/htmlcss/assets/img/responsive.png',
        lastAccessed: '2023-04-28T09:15:00',
    },
    {
        id: '101',
        title: 'Node.js & Express',
        progress: 10,
        color: 'purple',
        banner: 'https://fullstack.edu.vn/landing/htmlcss/assets/img/html-css-share.jpg',
        lastAccessed: '2023-03-12T16:45:00',
    },
];

const MyCoursesPopup = ({ onClose }: { onClose: () => void }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Simulate API fetch
        const fetchCourses = async () => {
            try {
                // Here you would make an actual API call to get the user's courses
                setTimeout(() => {
                    setCourses(MOCK_COURSES);
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleViewAll = () => {
        router.push('/courses/my-courses');
        onClose();
    };

    const handleCourseContinue = (courseId: string) => {
        router.push(`/courses/${courseId}`);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-[300px] sm:w-[350px] md:w-[400px] max-h-[450px] sm:max-h-[500px] overflow-hidden flex flex-col"
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
                        {courses.map((course) => (
                            <motion.div
                                key={course.id}
                                whileHover={{ backgroundColor: '#f7f9fa' }}
                                onClick={() => handleCourseContinue(course.id)}
                                className="p-3 sm:p-4 border-b border-gray-100 cursor-pointer"
                            >
                                <div className="flex items-center">
                                    <img
                                        src={course.banner || '/images/course-default.png'}
                                        alt={course.title}
                                        className="h-12 w-20 sm:h-16 sm:w-28 object-cover rounded-md mr-2 sm:mr-3"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-xs sm:text-sm mb-1 line-clamp-2">{course.title}</h4>
                                        <div className="flex items-center">
                                            <div className="bg-gray-200 h-1.5 rounded-full w-full flex-1 mr-2 sm:mr-3">
                                                <div
                                                    className="bg-blue-500 h-1.5 rounded-full"
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] sm:text-xs text-gray-600">{course.progress}%</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 sm:p-8 text-center text-gray-500">
                        <p className="text-sm">Bạn chưa tham gia khóa học nào</p>
                        <button
                            onClick={() => {
                                router.push('/');
                                onClose();
                            }}
                            className="mt-3 text-xs sm:text-sm bg-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-blue-600 transition"
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
