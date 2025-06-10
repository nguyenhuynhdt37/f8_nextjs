"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { useTheme } from '@/context/ThemeContext';
import { getDashboardStatistics, getRevenueSummary, getTopCourses, getGrowthComparison, getMonthlyRevenue } from '@/api/axios/api';
import { FiUsers, FiBookOpen, FiDollarSign, FiTrendingUp, FiCalendar, FiBarChart2, FiArrowUp, FiArrowDown } from 'react-icons/fi';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Format currency in VND
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const StatisticsDashboard = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [isLoading, setIsLoading] = useState(true);
    const [dashboardStats, setDashboardStats] = useState<any>(null);
    const [revenueSummary, setRevenueSummary] = useState<any>(null);
    const [topCourses, setTopCourses] = useState<any[]>([]);
    const [growthData, setGrowthData] = useState<any>(null);
    const [revenueChartData, setRevenueChartData] = useState<any>(null);
    const [periodType, setPeriodType] = useState<string>('month');

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
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                // Fetch all data in parallel
                const [dashboardRes, revenueRes, coursesRes, growthRes] = await Promise.all([
                    getDashboardStatistics(),
                    getRevenueSummary(),
                    getTopCourses(),
                    getGrowthComparison()
                ]);

                if (dashboardRes?.statusCode === 200) {
                    setDashboardStats(dashboardRes.data);
                }

                if (revenueRes?.statusCode === 200) {
                    setRevenueSummary(revenueRes.data);
                }

                if (coursesRes?.statusCode === 200) {
                    setTopCourses(coursesRes.data || []);
                }

                if (growthRes?.statusCode === 200) {
                    setGrowthData(growthRes.data);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [periodType]);

    useEffect(() => {
        const fetchMonthlyRevenue = async () => {
            try {
                const response = await getMonthlyRevenue();

                if (response?.statusCode === 200 && response.data) {
                    const monthlyData = response.data.monthlyData || [];
                    const labels = monthlyData.map((item: any) => item.month + '/' + response.data.year);
                    const revenueData = monthlyData.map((item: any) => item.revenue);

                    const chartData = {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Doanh thu (VNĐ)',
                                data: revenueData,
                                backgroundColor: isDark ? 'rgba(99, 102, 241, 0.7)' : 'rgba(79, 70, 229, 0.6)',
                                borderColor: isDark ? 'rgba(99, 102, 241, 1)' : 'rgba(79, 70, 229, 1)',
                                borderWidth: 1,
                            },
                        ],
                    };

                    const chartOptions = {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top' as const,
                                labels: {
                                    color: isDark ? '#e5e7eb' : '#374151'
                                }
                            },
                            title: {
                                display: true,
                                text: 'Doanh thu theo tháng (VNĐ)',
                                color: isDark ? '#e5e7eb' : '#374151',
                                font: {
                                    size: 16,
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function (context: any) {
                                        const value = context.raw;
                                        return `Doanh thu: ${formatCurrency(value)}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    color: isDark ? '#9ca3af' : '#6b7280',
                                    callback: function (value: any) {
                                        if (value >= 1000000) {
                                            return (value / 1000000) + 'M';
                                        }
                                        return value / 1000 + 'K';
                                    }
                                },
                                grid: {
                                    color: isDark ? 'rgba(156, 163, 175, 0.1)' : 'rgba(107, 114, 128, 0.1)'
                                }
                            },
                            x: {
                                ticks: {
                                    color: isDark ? '#9ca3af' : '#6b7280'
                                },
                                grid: {
                                    color: isDark ? 'rgba(156, 163, 175, 0.1)' : 'rgba(107, 114, 128, 0.1)'
                                }
                            }
                        }
                    };

                    setRevenueChartData({ data: chartData, options: chartOptions });
                }
            } catch (error) {
                console.error('Error fetching monthly revenue data:', error);
            }
        };

        fetchMonthlyRevenue();
    }, [isDark]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="relative w-20 h-20">
                    <div className={`animate-ping absolute inset-0 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'} opacity-75`}></div>
                    <div className={`relative rounded-full w-20 h-20 ${isDark ? 'bg-indigo-500' : 'bg-indigo-600'} flex items-center justify-center`}>
                        <FiBarChart2 className="w-10 h-10 text-white" />
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
            <div className="flex items-center justify-between mb-8">
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-2xl font-bold"
                >
                    Thống kê tổng quan
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex items-center space-x-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
                >
                    <FiCalendar className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </motion.div>
            </div>

            {/* Period selector */}
            <div className="flex justify-end mb-4">
                <div className={`inline-flex rounded-md shadow-sm ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                    <button
                        onClick={() => setPeriodType('month')}
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${periodType === 'month'
                            ? isDark
                                ? 'bg-indigo-600 text-white'
                                : 'bg-indigo-500 text-white'
                            : isDark
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Tháng
                    </button>
                    <button
                        onClick={() => setPeriodType('quarter')}
                        className={`px-4 py-2 text-sm font-medium ${periodType === 'quarter'
                            ? isDark
                                ? 'bg-indigo-600 text-white'
                                : 'bg-indigo-500 text-white'
                            : isDark
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Quý
                    </button>
                    <button
                        onClick={() => setPeriodType('year')}
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${periodType === 'year'
                            ? isDark
                                ? 'bg-indigo-600 text-white'
                                : 'bg-indigo-500 text-white'
                            : isDark
                                ? 'text-gray-300 hover:bg-gray-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        Năm
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <motion.div variants={itemVariants}>
                    <div className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`rounded-full p-3 mr-4 ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                                    <FiUsers className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Người dùng</p>
                                    <h3 className="text-2xl font-bold mt-1">{dashboardStats?.totalUsers?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                {growthData && (
                                    <>
                                        <span className={`flex items-center text-xs ${Number(growthData?.growth?.users) >= 0
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                            }`}>
                                            {Number(growthData?.growth?.users) >= 0 ? (
                                                <FiArrowUp className="mr-1" />
                                            ) : (
                                                <FiArrowDown className="mr-1" />
                                            )}
                                            {Math.abs(Number(growthData?.growth?.users)).toFixed(1)}%
                                        </span>
                                        <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            so với {periodType === 'month' ? 'tháng' : periodType === 'quarter' ? 'quý' : 'năm'} trước
                                        </span>
                                    </>
                                )}
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
                                    <FiBookOpen className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Khóa học</p>
                                    <h3 className="text-2xl font-bold mt-1">{dashboardStats?.totalCourses?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                {growthData && (
                                    <>
                                        <span className={`flex items-center text-xs ${Number(growthData?.growth?.courses) >= 0
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                            }`}>
                                            {Number(growthData?.growth?.courses) >= 0 ? (
                                                <FiArrowUp className="mr-1" />
                                            ) : (
                                                <FiArrowDown className="mr-1" />
                                            )}
                                            {Math.abs(Number(growthData?.growth?.courses)).toFixed(1)}%
                                        </span>
                                        <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            so với {periodType === 'month' ? 'tháng' : periodType === 'quarter' ? 'quý' : 'năm'} trước
                                        </span>
                                    </>
                                )}
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
                                    <FiDollarSign className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Doanh thu</p>
                                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(revenueSummary?.totalRevenue || 0).split('₫')[0]}</h3>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                {growthData && (
                                    <>
                                        <span className={`flex items-center text-xs ${Number(growthData?.growth?.revenue) >= 0
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                            }`}>
                                            {Number(growthData?.growth?.revenue) >= 0 ? (
                                                <FiArrowUp className="mr-1" />
                                            ) : (
                                                <FiArrowDown className="mr-1" />
                                            )}
                                            {Math.abs(Number(growthData?.growth?.revenue)).toFixed(1)}%
                                        </span>
                                        <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            so với {periodType === 'month' ? 'tháng' : periodType === 'quarter' ? 'quý' : 'năm'} trước
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={`h-1 w-full ${isDark ? 'bg-purple-600' : 'bg-purple-500'}`}></div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <div className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`rounded-full p-3 mr-4 ${isDark ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-600'}`}>
                                    <FiTrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Lượt đăng ký</p>
                                    <h3 className="text-2xl font-bold mt-1">{dashboardStats?.totalEnrollments?.toLocaleString() || 0}</h3>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                {growthData && (
                                    <>
                                        <span className={`flex items-center text-xs ${Number(growthData?.growth?.enrollments) >= 0
                                            ? 'text-green-500'
                                            : 'text-red-500'
                                            }`}>
                                            {Number(growthData?.growth?.enrollments) >= 0 ? (
                                                <FiArrowUp className="mr-1" />
                                            ) : (
                                                <FiArrowDown className="mr-1" />
                                            )}
                                            {Math.abs(Number(growthData?.growth?.enrollments)).toFixed(1)}%
                                        </span>
                                        <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            so với {periodType === 'month' ? 'tháng' : periodType === 'quarter' ? 'quý' : 'năm'} trước
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className={`h-1 w-full ${isDark ? 'bg-amber-600' : 'bg-amber-500'}`}></div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Revenue Chart */}
            <motion.div
                variants={itemVariants}
                className={`mt-8 rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
                <div className="p-5">
                    <h2 className="text-xl font-bold mb-4">Doanh thu theo tháng</h2>
                    <div className="h-80">
                        {revenueChartData && <Bar data={revenueChartData.data} options={revenueChartData.options} />}
                    </div>
                </div>
            </motion.div>

            {/* Top Courses and Revenue Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                {/* Top Courses */}
                <motion.div
                    variants={itemVariants}
                    className={`col-span-2 rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                >
                    <div className="p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Khóa học bán chạy nhất</h2>
                            <Link href="/admin/statistics/courses" className={`text-sm ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}>
                                Xem tất cả
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className={`${isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Khóa học</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Học viên</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Đánh giá</th>
                                        <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Doanh thu</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {topCourses.map((course: any, index: number) => (
                                        <tr key={course.courseId} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <Link
                                                    href={`/admin/course/edit/${course.courseId}`}
                                                    className={`font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
                                                >
                                                    {course.courseTitle}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-4 text-center whitespace-nowrap">
                                                {course.enrollmentCount}
                                            </td>
                                            <td className="px-4 py-4 text-center whitespace-nowrap">
                                                {course.avgRating ? (
                                                    <div className="flex items-center justify-center">
                                                        <span className="mr-1">{course.avgRating.toFixed(1)}</span>
                                                        <span className="text-yellow-400">★</span>
                                                    </div>
                                                ) : (
                                                    <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Chưa có</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-right whitespace-nowrap font-medium">
                                                {formatCurrency(course.revenue)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.div>

                {/* Revenue Summary */}
                <motion.div
                    variants={itemVariants}
                    className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
                >
                    <div className="p-5">
                        <h2 className="text-xl font-bold mb-4">Tổng quan doanh thu</h2>

                        <div className="space-y-4">
                            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Hôm nay</span>
                                    <span className="font-medium">{formatCurrency(revenueSummary?.todayRevenue || 0)}</span>
                                </div>
                            </div>

                            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tuần này</span>
                                    <span className="font-medium">{formatCurrency(revenueSummary?.weekRevenue || 0)}</span>
                                </div>
                            </div>

                            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tháng này</span>
                                    <span className="font-medium">{formatCurrency(revenueSummary?.monthRevenue || 0)}</span>
                                </div>
                            </div>

                            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Năm nay</span>
                                    <span className="font-medium">{formatCurrency(revenueSummary?.yearRevenue || 0)}</span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link
                                    href="/admin/statistics/revenue"
                                    className={`w-full inline-flex justify-center items-center px-4 py-2 rounded-lg ${isDark
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                        : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                                        }`}
                                >
                                    Xem chi tiết doanh thu
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Quick Access Links */}
            <motion.div
                variants={itemVariants}
                className="mt-8 flex flex-wrap gap-4"
            >
                <Link
                    href="/admin/statistics/courses"
                    className={`px-6 py-3 rounded-lg shadow-md flex items-center ${isDark
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                >
                    <FiBookOpen className="mr-2" />
                    Thống kê khóa học
                </Link>

                <Link
                    href="/admin/statistics/revenue"
                    className={`px-6 py-3 rounded-lg shadow-md flex items-center ${isDark
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                >
                    <FiDollarSign className="mr-2" />
                    Thống kê doanh thu
                </Link>

                <Link
                    href="/admin/statistics/users"
                    className={`px-6 py-3 rounded-lg shadow-md flex items-center ${isDark
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-purple-500 hover:bg-purple-600 text-white'
                        }`}
                >
                    <FiUsers className="mr-2" />
                    Thống kê người dùng
                </Link>
            </motion.div>
        </motion.div>
    );
};

export default StatisticsDashboard; 