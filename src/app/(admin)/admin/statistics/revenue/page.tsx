import React from 'react';
import Link from 'next/link';
import axiosInstance from '@/api/axios/axiosInstance';

// Định nghĩa kiểu dữ liệu
interface RevenueSummary {
    totalRevenue: number;
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
    yearRevenue: number;
    growthRateMonth: number;
    growthRateYear: number;
}

interface MonthlyRevenue {
    month: string;
    revenue: number;
    orderCount: number;
    averageOrderValue: number;
}

interface RevenueData {
    summary: RevenueSummary;
    monthlyData: MonthlyRevenue[];
    paymentMethods: {
        method: string;
        count: number;
        revenue: number;
    }[];
}

// Server-side data fetching function
async function fetchRevenueStatistics(): Promise<RevenueData> {
    try {
        const [summaryRes, monthlyRes, methodsRes] = await Promise.all([
            axiosInstance.get('/statistics/revenue/summary'),
            axiosInstance.get('/statistics/revenue/monthly'),
            axiosInstance.get('/statistics/revenue/payment-methods')
        ]);

        return {
            summary: summaryRes.data.data,
            monthlyData: monthlyRes.data.data,
            paymentMethods: methodsRes.data.data
        };
    } catch (error) {
        console.error('Error fetching revenue statistics:', error);
        return {
            summary: {
                totalRevenue: 0,
                todayRevenue: 0,
                weekRevenue: 0,
                monthRevenue: 0,
                yearRevenue: 0,
                growthRateMonth: 0,
                growthRateYear: 0
            },
            monthlyData: [],
            paymentMethods: []
        };
    }
}

export default async function RevenueStatisticsPage() {
    const revenueData = await fetchRevenueStatistics();

    // Utility function for formatting currency
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Tính tổng số đơn hàng từ dữ liệu hàng tháng
    const totalOrders = revenueData.monthlyData.reduce((sum: number, month: MonthlyRevenue) => sum + month.orderCount, 0);

    // Tính giá trị đơn hàng trung bình
    const averageOrderValue = revenueData.summary.totalRevenue / (totalOrders || 1);

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Thống kê doanh thu</h1>
                <Link
                    href="/admin/statistics"
                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
                >
                    Quay lại
                </Link>
            </div>

            {/* Thẻ tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Tổng doanh thu</h3>
                    <p className="text-2xl font-bold">{formatCurrency(revenueData.summary.totalRevenue)}</p>
                    <div className={`text-xs mt-2 ${revenueData.summary.growthRateYear > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {revenueData.summary.growthRateYear > 0 ? '↑' : '↓'} {Math.abs(revenueData.summary.growthRateYear).toFixed(1)}% so với năm trước
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Doanh thu tháng này</h3>
                    <p className="text-2xl font-bold">{formatCurrency(revenueData.summary.monthRevenue)}</p>
                    <div className={`text-xs mt-2 ${revenueData.summary.growthRateMonth > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {revenueData.summary.growthRateMonth > 0 ? '↑' : '↓'} {Math.abs(revenueData.summary.growthRateMonth).toFixed(1)}% so với tháng trước
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Tổng số đơn hàng</h3>
                    <p className="text-2xl font-bold">{totalOrders}</p>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Giá trị đơn hàng trung bình</h3>
                    <p className="text-2xl font-bold">{formatCurrency(averageOrderValue)}</p>
                </div>
            </div>

            {/* Doanh thu theo tháng */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
                <h2 className="text-lg font-bold mb-4">Doanh thu theo tháng</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tháng
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doanh thu
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số đơn hàng
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Giá trị đơn trung bình
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {revenueData.monthlyData.map((month: MonthlyRevenue, index: number) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {month.month}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatCurrency(month.revenue)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {month.orderCount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatCurrency(month.averageOrderValue)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
                <h2 className="text-lg font-bold mb-4">Thống kê theo phương thức thanh toán</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phương thức
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số đơn hàng
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doanh thu
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tỷ lệ
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {revenueData.paymentMethods.map((method, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {method.method}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {method.count}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatCurrency(method.revenue)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {((method.revenue / revenueData.summary.totalRevenue) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Các nút điều hướng */}
            <div className="flex justify-between mt-8">
                <Link
                    href="/admin/statistics"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Quay lại tổng quan
                </Link>
                <Link
                    href="/admin/statistics/courses"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Xem thống kê khóa học
                </Link>
            </div>
        </div>
    );
} 