"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { getUserStatistics } from '@/api/axios/api';
import { FiUsers, FiUserPlus, FiUserCheck, FiArrowLeft, FiCalendar, FiFilter } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Format date
const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

const UserStatisticsPage = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState<any>({
        totalUsers: 0,
        activeUsers: 0,
        newUsersThisMonth: 0,
        newUsersLastMonth: 0,
        userGrowth: 0,
        monthlyRegistrations: [],
        recentUsers: []
    });
    const [timeRange, setTimeRange] = useState('6');

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
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                const response = await getUserStatistics();

                if (response?.statusCode === 200) {
                    setUserData({
                        totalUsers: response.data.totalUsers || 0,
                        activeUsers: response.data.activeUsers || 0,
                        newUsersThisMonth: response.data.newUsersThisMonth || 0,
                        newUsersLastMonth: response.data.newUsersLastMonth || 0,
                        userGrowth: response.data.userGrowth || 0,
                        monthlyRegistrations: response.data.monthlyRegistrations || [],
                        recentUsers: response.data.recentUsers || []
                    });
                }
            } catch (error) {
                console.error('Error fetching user statistics:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Filter monthly data based on selected time range
    const filteredMonthlyData = () => {
        const months = parseInt(timeRange);
        if (months === 0 || !userData.monthlyRegistrations) return userData.monthlyRegistrations;
        return userData.monthlyRegistrations.slice(-months);
    };

    // Prepare chart data
    const chartData = {
        labels: filteredMonthlyData().map((item: any) => item.month),
        datasets: [
            {
                label: 'Người dùng mới',
                data: filteredMonthlyData().map((item: any) => item.count),
                borderColor: isDark ? 'rgba(99, 102, 241, 1)' : 'rgba(59, 130, 246, 1)',
                backgroundColor: isDark ? 'rgba(99, 102, 241, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: isDark ? 'rgba(129, 140, 248, 1)' : 'rgba(96, 165, 250, 1)',
                pointBorderColor: isDark ? '#1f2937' : '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: isDark ? '#e5e7eb' : '#374151',
                    font: {
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: 'Người dùng đăng ký theo tháng',
                color: isDark ? '#e5e7eb' : '#374151',
                font: {
                    size: 16,
                    weight: 'bold' as const
                }
            },
            tooltip: {
                backgroundColor: isDark ? '#374151' : '#ffffff',
                titleColor: isDark ? '#e5e7eb' : '#1f2937',
                bodyColor: isDark ? '#e5e7eb' : '#1f2937',
                borderColor: isDark ? '#4b5563' : '#e5e7eb',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                callbacks: {
                    title: function (tooltipItems: any) {
                        return `Tháng ${tooltipItems[0].label}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.8)',
                },
                ticks: {
                    color: isDark ? '#9ca3af' : '#4b5563',
                },
                title: {
                    display: true,
                    text: 'Tháng',
                    color: isDark ? '#d1d5db' : '#4b5563',
                }
            },
            y: {
                grid: {
                    color: isDark ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.8)',
                },
                ticks: {
                    color: isDark ? '#9ca3af' : '#4b5563',
                },
                title: {
                    display: true,
                    text: 'Số lượng người dùng',
                    color: isDark ? '#d1d5db' : '#4b5563',
                },
                beginAtZero: true
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="relative w-20 h-20">
                    <div className={`animate-ping absolute inset-0 rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'} opacity-75`}></div>
                    <div className={`relative rounded-full w-20 h-20 ${isDark ? 'bg-indigo-500' : 'bg-indigo-600'} flex items-center justify-center`}>
                        <FiUsers className="w-10 h-10 text-white" />
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
                    Thống kê người dùng
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
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <motion.div variants={itemVariants}>
                    <div className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`rounded-full p-3 mr-4 ${isDark ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-600'}`}>
                                    <FiUsers className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tổng người dùng</p>
                                    <h3 className="text-2xl font-bold mt-1">{userData.totalUsers.toLocaleString()}</h3>
                                </div>
                            </div>
                        </div>
                        <div className={`h-1 w-full ${isDark ? 'bg-indigo-600' : 'bg-indigo-500'}`}></div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <div className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`rounded-full p-3 mr-4 ${isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-600'}`}>
                                    <FiUserCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Người dùng hoạt động</p>
                                    <h3 className="text-2xl font-bold mt-1">{userData.activeUsers.toLocaleString()}</h3>
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
                                <div className={`rounded-full p-3 mr-4 ${isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
                                    <FiUserPlus className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Người dùng mới (tháng này)</p>
                                    <h3 className="text-2xl font-bold mt-1">{userData.newUsersThisMonth.toLocaleString()}</h3>
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
                                <div className={`rounded-full p-3 mr-4 ${userData.userGrowth >= 0
                                    ? (isDark ? 'bg-emerald-900/30 text-emerald-300' : 'bg-emerald-100 text-emerald-600')
                                    : (isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-600')
                                    }`}>
                                    {userData.userGrowth >= 0 ? (
                                        <FiUserPlus className="w-6 h-6" />
                                    ) : (
                                        <FiUsers className="w-6 h-6" />
                                    )}
                                </div>
                                <div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tăng trưởng</p>
                                    <div className="flex items-center mt-1">
                                        <h3 className={`text-2xl font-bold ${userData.userGrowth >= 0
                                            ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
                                            : (isDark ? 'text-red-400' : 'text-red-600')
                                            }`}>
                                            {Math.abs(userData.userGrowth)}%
                                        </h3>
                                        <span className={`ml-1 ${userData.userGrowth >= 0
                                            ? (isDark ? 'text-emerald-400' : 'text-emerald-600')
                                            : (isDark ? 'text-red-400' : 'text-red-600')
                                            }`}>
                                            {userData.userGrowth >= 0 ? '↑' : '↓'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`h-1 w-full ${userData.userGrowth >= 0
                            ? (isDark ? 'bg-emerald-600' : 'bg-emerald-500')
                            : (isDark ? 'bg-red-600' : 'bg-red-500')
                            }`}></div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Chart Section */}
            <motion.div
                variants={itemVariants}
                className={`mt-8 rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} p-5`}
            >
                <div className="flex flex-wrap items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Biểu đồ tăng trưởng người dùng</h2>

                    <div className="flex items-center">
                        <label className={`mr-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            Hiển thị:
                        </label>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className={`px-3 py-1 rounded-lg border ${isDark
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-700'
                                }`}
                        >
                            <option value="3">3 tháng gần nhất</option>
                            <option value="6">6 tháng gần nhất</option>
                            <option value="12">12 tháng gần nhất</option>
                            <option value="0">Tất cả</option>
                        </select>
                    </div>
                </div>

                <div className="h-80">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </motion.div>

            {/* Recent Users */}
            <motion.div
                variants={itemVariants}
                className={`mt-8 rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
                <div className="p-5">
                    <h2 className="text-xl font-bold mb-4">Người dùng đăng ký gần đây</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`${isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Tên người dùng
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                        Vai trò
                                    </th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">
                                        Ngày đăng ký
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {userData.recentUsers.map((user: any) => (
                                    <tr key={user.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {user.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.fullName}
                                                        className="w-8 h-8 rounded-full mr-3 object-cover"
                                                    />
                                                ) : (
                                                    <div className={`w-8 h-8 rounded-full mr-3 flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-gray-200'
                                                        }`}>
                                                        <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                                            {user.fullName?.charAt(0) || user.email?.charAt(0) || '?'}
                                                        </span>
                                                    </div>
                                                )}
                                                <Link
                                                    href={`/admin/users/edit/${user.id}`}
                                                    className={`font-medium ${isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'}`}
                                                >
                                                    {user.fullName || 'Không có tên'}
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {user.email}
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'admin'
                                                ? (isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800')
                                                : (isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800')
                                                }`}>
                                                {user.role === 'admin' ? 'Admin' : 'Người dùng'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap">
                                            <div className="flex items-center justify-center">
                                                <FiCalendar className={`mr-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                                                <span>{formatDate(user.createdAt)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {userData.recentUsers.length === 0 && (
                        <div className={`text-center py-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Không có dữ liệu người dùng gần đây
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default UserStatisticsPage; 