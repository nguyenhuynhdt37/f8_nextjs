"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { FiBookOpen, FiDollarSign, FiUsers, FiStar, FiArrowLeft, FiCalendar, FiFilter } from 'react-icons/fi';
import { getCourseStatistics } from '@/api/axios/api';

// Format currency in VND
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Format date
const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

const CourseStatisticsPage = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [isLoading, setIsLoading] = useState(true);
    const [courseStats, setCourseStats] = useState<any[]>([]);
    const [sortField, setSortField] = useState('revenue');
    const [sortOrder, setSortOrder] = useState('desc');
    const [filterLevel, setFilterLevel] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [uniqueLevels, setUniqueLevels] = useState<string[]>([]);
    const [uniqueCategories, setUniqueCategories] = useState<string[]>([]);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 24
            }
        }
    };

    useEffect(() => {
        const fetchCourseData = async () => {
            setIsLoading(true);
            try {
                const response = await getCourseStatistics();

                if (response?.statusCode === 200) {
                    const courses = response.data || [];
                    setCourseStats(courses);

                    // Extract unique levels and categories
                    const levels = [...new Set(courses.map((course: any) => course.level))].filter(Boolean) as string[];
                    const categories = [...new Set(courses.map((course: any) => course.categoryName))].filter(Boolean) as string[];

                    setUniqueLevels(levels);
                    setUniqueCategories(categories);
                }
            } catch (error) {
                console.error('Error fetching course statistics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseData();
    }, []);

    // Handle sorting
    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    // Filter and sort courses
    const filteredCourses = courseStats
        .filter(course => {
            if (filterLevel !== 'all' && course.level !== filterLevel) return false;
            if (filterCategory !== 'all' && course.categoryName !== filterCategory) return false;
            return true;
        })
        .sort((a, b) => {
            const multiplier = sortOrder === 'asc' ? 1 : -1;

            if (sortField === 'title') {
                return multiplier * a.courseTitle.localeCompare(b.courseTitle);
            } else if (sortField === 'enrollments') {
                return multiplier * ((a.enrollmentCount || 0) - (b.enrollmentCount || 0));
            } else if (sortField === 'rating') {
                return multiplier * ((a.avgRating || 0) - (b.avgRating || 0));
            } else if (sortField === 'date') {
                return multiplier * (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
            } else {
                // Default to revenue
                return multiplier * ((a.revenue || 0) - (b.revenue || 0));
            }
        });

    // Calculate totals
    const totalRevenue = courseStats.reduce((sum, course) => sum + (course.revenue || 0), 0);
    const totalEnrollments = courseStats.reduce((sum, course) => sum + (course.enrollmentCount || 0), 0);
    const averageRating = courseStats.length > 0
        ? courseStats.reduce((sum, course) => sum + (course.avgRating || 0), 0) / courseStats.length
        : 0;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="relative w-20 h-20">
                    <div className={`animate-ping absolute inset-0 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-500'} opacity-75`}></div>
                    <div className={`relative rounded-full w-20 h-20 ${isDark ? 'bg-blue-500' : 'bg-blue-600'} flex items-center justify-center`}>
                        <FiBookOpen className="w-10 h-10 text-white" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`p-6 space-y-6 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}
        >
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold"
                >
                    Thống kê khóa học
                </motion.h1>

                <Link
                    href="/admin/statistics"
                    className={`flex items-center px-4 py-2 rounded-lg ${isDark
                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                        : 'bg-white hover:bg-gray-100 text-gray-700'
                        } transition-colors shadow-sm`}
                >
                    <FiArrowLeft className="mr-2" />
                    <span>Quay lại</span>
                </Link>
            </div>

            {/* Overview Cards */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
                <motion.div variants={itemVariants}>
                    <div className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`rounded-full p-3 mr-4 ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                                    <FiBookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tổng số khóa học</p>
                                    <h3 className="text-2xl font-bold mt-1">{courseStats.length}</h3>
                                </div>
                            </div>
                        </div>
                        <div className={`h-1 w-full ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}></div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <div className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`rounded-full p-3 mr-4 ${isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-600'}`}>
                                    <FiDollarSign className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tổng doanh thu</p>
                                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</h3>
                                </div>
                            </div>
                        </div>
                        <div className={`h-1 w-full ${isDark ? 'bg-green-600' : 'bg-green-500'}`}></div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <div className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`rounded-full p-3 mr-4 ${isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                                    <FiUsers className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tổng lượt đăng ký</p>
                                    <h3 className="text-2xl font-bold mt-1">{totalEnrollments.toLocaleString()}</h3>
                                </div>
                            </div>
                        </div>
                        <div className={`h-1 w-full ${isDark ? 'bg-purple-600' : 'bg-purple-500'}`}></div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Filters */}
            <motion.div
                variants={itemVariants}
                className={`mt-8 rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} p-5`}
            >
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center">
                        <FiFilter className={`mr-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Lọc:</span>
                    </div>

                    <div className="flex-1 flex flex-wrap gap-4">
                        <div className="min-w-[200px]">
                            <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Cấp độ</label>
                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-700'
                                    }`}
                            >
                                <option value="all">Tất cả cấp độ</option>
                                {uniqueLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>

                        <div className="min-w-[200px]">
                            <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Danh mục</label>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-700'
                                    }`}
                            >
                                <option value="all">Tất cả danh mục</option>
                                {uniqueCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="min-w-[200px]">
                            <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Sắp xếp theo</label>
                            <select
                                value={sortField}
                                onChange={(e) => setSortField(e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-700'
                                    }`}
                            >
                                <option value="revenue">Doanh thu</option>
                                <option value="enrollments">Lượt đăng ký</option>
                                <option value="rating">Đánh giá</option>
                                <option value="title">Tên khóa học</option>
                                <option value="date">Ngày tạo</option>
                            </select>
                        </div>

                        <div className="min-w-[200px]">
                            <label className={`block text-xs mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Thứ tự</label>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className={`w-full px-3 py-2 rounded-lg border ${isDark
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-700'
                                    }`}
                            >
                                <option value="desc">Giảm dần</option>
                                <option value="asc">Tăng dần</option>
                            </select>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Courses Table */}
            <motion.div
                variants={itemVariants}
                className={`mt-8 rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
                <div className="p-5">
                    <h2 className="text-xl font-bold mb-4">Danh sách khóa học</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`${isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                                    <th
                                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('title')}
                                    >
                                        <div className="flex items-center">
                                            <span>Khóa học</span>
                                            {sortField === 'title' && (
                                                <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Danh mục
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                        Cấp độ
                                    </th>
                                    <th
                                        className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('enrollments')}
                                    >
                                        <div className="flex items-center justify-center">
                                            <span>Đăng ký</span>
                                            {sortField === 'enrollments' && (
                                                <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('revenue')}
                                    >
                                        <div className="flex items-center justify-end">
                                            <span>Doanh thu</span>
                                            {sortField === 'revenue' && (
                                                <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('rating')}
                                    >
                                        <div className="flex items-center justify-center">
                                            <span>Đánh giá</span>
                                            {sortField === 'rating' && (
                                                <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                    <th
                                        className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider cursor-pointer"
                                        onClick={() => handleSort('date')}
                                    >
                                        <div className="flex items-center justify-center">
                                            <span>Ngày tạo</span>
                                            {sortField === 'date' && (
                                                <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredCourses.map((course) => (
                                    <tr key={course.courseId} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <Link
                                                href={`/admin/course/edit/${course.courseId}`}
                                                className={`font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
                                            >
                                                {course.courseTitle}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {course.categoryName || 'Không có'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${isDark
                                                ? 'bg-blue-900/30 text-blue-300'
                                                : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {course.level}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap">
                                            {course.enrollmentCount}
                                        </td>
                                        <td className="px-4 py-4 text-right whitespace-nowrap font-medium">
                                            {formatCurrency(course.revenue)}
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap">
                                            {course.avgRating ? (
                                                <div className="flex items-center justify-center">
                                                    <span>{course.avgRating.toFixed(1)}</span>
                                                    <FiStar className={`ml-1 ${isDark ? 'text-yellow-300' : 'text-yellow-500'}`} />
                                                </div>
                                            ) : (
                                                <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Chưa có</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center">
                                                <FiCalendar className={`mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <span>{formatDate(course.createdAt)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Không tìm thấy khóa học nào phù hợp với bộ lọc
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CourseStatisticsPage;