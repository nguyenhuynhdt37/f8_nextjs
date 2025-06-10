"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { getRevenueSummary, getMonthlyRevenue } from '@/api/axios/api';
import { FiDollarSign, FiCalendar, FiCreditCard, FiTrendingUp, FiArrowLeft } from 'react-icons/fi';
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

// Format currency in VND
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const RevenueStatisticsPage = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [isLoading, setIsLoading] = useState(true);
    const [revenueSummary, setRevenueSummary] = useState<any>(null);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [revenueChartData, setRevenueChartData] = useState<any>(null);
    const [paymentMethods, setPaymentMethods] = useState<any[]>([
        { method: 'Thẻ tín dụng', count: 0, revenue: 0 },
        { method: 'Chuyển khoản', count: 0, revenue: 0 },
        { method: 'Ví điện tử', count: 0, revenue: 0 }
    ]);

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
        const fetchRevenueData = async () => {
            setIsLoading(true);
            try {
                // Fetch revenue summary
                const summaryRes = await getRevenueSummary();
                if (summaryRes?.statusCode === 200) {
                    setRevenueSummary(summaryRes.data);
                }

                // Fetch monthly revenue data
                const monthlyRes = await getMonthlyRevenue();
                if (monthlyRes?.statusCode === 200) {
                    setMonthlyData(monthlyRes.data.monthlyData || []);
                }

                // Mock payment methods data (replace with actual API call when available)
                setPaymentMethods([
                    { method: 'Thẻ tín dụng', count: 156, revenue: 45600000 },
                    { method: 'Chuyển khoản', count: 98, revenue: 32400000 },
                    { method: 'Ví điện tử', count: 124, revenue: 38700000 }
                ]);
            } catch (error) {
                console.error('Error fetching revenue data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRevenueData();
    }, []);

    useEffect(() => {
        if (monthlyData.length > 0) {
            const labels = monthlyData.map(item => item.month);
            const revenueData = monthlyData.map(item => item.revenue);
            const orderCountData = monthlyData.map(item => item.orderCount);

            const chartData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Doanh thu',
                        data: revenueData,
                        borderColor: isDark ? 'rgba(99, 102, 241, 1)' : 'rgba(79, 70, 229, 1)',
                        backgroundColor: isDark ? 'rgba(99, 102, 241, 0.5)' : 'rgba(79, 70, 229, 0.5)',
                        yAxisID: 'y',
                        tension: 0.3
                    },
                    {
                        label: 'Số đơn hàng',
                        data: orderCountData,
                        borderColor: isDark ? 'rgba(16, 185, 129, 1)' : 'rgba(5, 150, 105, 1)',
                        backgroundColor: isDark ? 'rgba(16, 185, 129, 0.5)' : 'rgba(5, 150, 105, 0.5)',
                        yAxisID: 'y1',
                        tension: 0.3
                    }
                ]
            };

            const chartOptions = {
                responsive: true,
                interaction: {
                    mode: 'index' as const,
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top' as const,
                        labels: {
                            color: isDark ? '#e5e7eb' : '#374151'
                        }
                    },
                    title: {
                        display: true,
                        text: 'Doanh thu và số đơn hàng theo tháng',
                        color: isDark ? '#e5e7eb' : '#374151',
                        font: {
                            size: 16,
                            weight: 'bold' as const
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context: any) {
                                const label = context.dataset.label || '';
                                const value = context.raw;

                                if (context.datasetIndex === 0) {
                                    return `${label}: ${formatCurrency(value)}`;
                                } else {
                                    return `${label}: ${value}`;
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear' as const,
                        display: true,
                        position: 'left' as const,
                        title: {
                            display: true,
                            text: 'Doanh thu (VNĐ)',
                            color: isDark ? '#e5e7eb' : '#374151',
                        },
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
                    y1: {
                        type: 'linear' as const,
                        display: true,
                        position: 'right' as const,
                        title: {
                            display: true,
                            text: 'Số đơn hàng',
                            color: isDark ? '#e5e7eb' : '#374151',
                        },
                        ticks: {
                            color: isDark ? '#9ca3af' : '#6b7280',
                        },
                        grid: {
                            drawOnChartArea: false,
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
    }, [monthlyData, isDark]);

    // Calculate totals
    const totalOrders = monthlyData.reduce((sum, month) => sum + month.orderCount, 0);
    const totalRevenue = revenueSummary?.totalRevenue || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="relative w-20 h-20">
                    <div className={`animate-ping absolute inset-0 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-500'} opacity-75`}></div>
                    <div className={`relative rounded-full w-20 h-20 ${isDark ? 'bg-green-500' : 'bg-green-600'} flex items-center justify-center`}>
                        <FiDollarSign className="w-10 h-10 text-white" />
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
                    Thống kê doanh thu
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
                                <div className={`rounded-full p-3 mr-4 ${isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-600'}`}>
                                    <FiDollarSign className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tổng doanh thu</p>
                                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(totalRevenue)}</h3>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <span className={`flex items-center text-xs ${(revenueSummary?.growthRateYear || 0) >= 0
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                    }`}>
                                    {(revenueSummary?.growthRateYear || 0) >= 0 ? '+' : ''}
                                    {(revenueSummary?.growthRateYear || 0).toFixed(1)}%
                                </span>
                                <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    so với năm trước
                                </span>
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
                                    <FiCalendar className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Doanh thu tháng này</p>
                                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(revenueSummary?.monthRevenue || 0)}</h3>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <span className={`flex items-center text-xs ${(revenueSummary?.growthRateMonth || 0) >= 0
                                    ? 'text-green-500'
                                    : 'text-red-500'
                                    }`}>
                                    {(revenueSummary?.growthRateMonth || 0) >= 0 ? '+' : ''}
                                    {(revenueSummary?.growthRateMonth || 0).toFixed(1)}%
                                </span>
                                <span className={`ml-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    so với tháng trước
                                </span>
                            </div>
                        </div>
                        <div className={`h-1 w-full ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}></div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                    <div className={`rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                        <div className="p-5">
                            <div className="flex items-center">
                                <div className={`rounded-full p-3 mr-4 ${isDark ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-600'}`}>
                                    <FiCreditCard className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Tổng số đơn hàng</p>
                                    <h3 className="text-2xl font-bold mt-1">{totalOrders.toLocaleString()}</h3>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {monthlyData[monthlyData.length - 1]?.orderCount || 0} đơn trong tháng gần nhất
                                </span>
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
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Giá trị đơn trung bình</p>
                                    <h3 className="text-2xl font-bold mt-1">{formatCurrency(averageOrderValue)}</h3>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center">
                                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Dựa trên {totalOrders} đơn hàng
                                </span>
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
                        {revenueChartData && <Line data={revenueChartData.data} options={revenueChartData.options} />}
                    </div>
                </div>
            </motion.div>

            {/* Monthly Revenue Table */}
            <motion.div
                variants={itemVariants}
                className={`mt-8 rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
                <div className="p-5">
                    <h2 className="text-xl font-bold mb-4">Doanh thu chi tiết theo tháng</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`${isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Tháng</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Doanh thu</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Số đơn hàng</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Giá trị đơn trung bình</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {monthlyData.map((month, index) => (
                                    <tr key={index} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
                                        <td className="px-4 py-4 whitespace-nowrap font-medium">
                                            {month.month}
                                        </td>
                                        <td className="px-4 py-4 text-right whitespace-nowrap">
                                            {formatCurrency(month.revenue)}
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap">
                                            {month.orderCount}
                                        </td>
                                        <td className="px-4 py-4 text-right whitespace-nowrap">
                                            {formatCurrency(month.averageOrderValue)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            {/* Payment Methods */}
            <motion.div
                variants={itemVariants}
                className={`mt-8 rounded-xl shadow-lg overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'}`}
            >
                <div className="p-5">
                    <h2 className="text-xl font-bold mb-4">Phương thức thanh toán</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className={`${isDark ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
                                    <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">Phương thức</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider">Số đơn hàng</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Doanh thu</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider">Tỷ lệ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {paymentMethods.map((method, index) => (
                                    <tr key={index} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors`}>
                                        <td className="px-4 py-4 whitespace-nowrap font-medium">
                                            {method.method}
                                        </td>
                                        <td className="px-4 py-4 text-center whitespace-nowrap">
                                            {method.count}
                                        </td>
                                        <td className="px-4 py-4 text-right whitespace-nowrap">
                                            {formatCurrency(method.revenue)}
                                        </td>
                                        <td className="px-4 py-4 text-right whitespace-nowrap">
                                            {((method.revenue / totalRevenue) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className={`${isDark ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
                                <tr>
                                    <td className="px-4 py-4 font-medium">Tổng cộng</td>
                                    <td className="px-4 py-4 text-center font-medium">
                                        {paymentMethods.reduce((sum, method) => sum + method.count, 0)}
                                    </td>
                                    <td className="px-4 py-4 text-right font-medium">
                                        {formatCurrency(paymentMethods.reduce((sum, method) => sum + method.revenue, 0))}
                                    </td>
                                    <td className="px-4 py-4 text-right font-medium">100%</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RevenueStatisticsPage; 