import React from 'react';
import Link from 'next/link';
import axiosInstance from '@/api/axios/axiosInstance';

// Định nghĩa kiểu dữ liệu
interface UserSummary {
    totalUsers: number;
    newUsersThisMonth: number;
    activeUsers: number;
    premiumUsers: number;
    averageCoursesPerUser: number;
    userRetentionRate: number;
}

interface UsersByMonth {
    month: string;
    newUsers: number;
    totalUsers: number;
    activeUsers: number;
}

interface TopUser {
    userId: number;
    userName: string;
    email: string;
    avatar: string;
    coursesEnrolled: number;
    totalSpent: number;
    lastActive: string;
}

interface UserStats {
    summary: UserSummary;
    usersByMonth: UsersByMonth[];
    topUsers: TopUser[];
}

// Server-side data fetching function
async function fetchUserStatistics(): Promise<UserStats> {
    try {
        const [summaryRes, monthlyRes, topUsersRes] = await Promise.all([
            axiosInstance.get('/statistics/users/summary'),
            axiosInstance.get('/statistics/users/monthly'),
            axiosInstance.get('/statistics/users/top', { params: { count: 10 } })
        ]);

        return {
            summary: summaryRes.data.data,
            usersByMonth: monthlyRes.data.data,
            topUsers: topUsersRes.data.data
        };
    } catch (error) {
        console.error('Error fetching user statistics:', error);
        return {
            summary: {
                totalUsers: 0,
                newUsersThisMonth: 0,
                activeUsers: 0,
                premiumUsers: 0,
                averageCoursesPerUser: 0,
                userRetentionRate: 0
            },
            usersByMonth: [],
            topUsers: []
        };
    }
}

export default async function UserStatisticsPage() {
    const userStats = await fetchUserStatistics();

    // Utility function for formatting currency
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Utility function for formatting date
    const formatDate = (dateString: string): string => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Thống kê người dùng</h1>
                <Link
                    href="/admin/statistics"
                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
                >
                    Quay lại
                </Link>
            </div>

            {/* Thẻ tổng quan */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Tổng số người dùng</h3>
                    <p className="text-2xl font-bold">{userStats.summary.totalUsers}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {userStats.summary.newUsersThisMonth} người dùng mới trong tháng này
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Người dùng trả phí</h3>
                    <p className="text-2xl font-bold">{userStats.summary.premiumUsers}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {((userStats.summary.premiumUsers / userStats.summary.totalUsers) * 100).toFixed(1)}% tổng số người dùng
                    </p>
                </div>

                <div className="bg-white shadow rounded-lg p-4">
                    <h3 className="text-sm text-gray-500 mb-1">Tỷ lệ giữ chân người dùng</h3>
                    <p className="text-2xl font-bold">{userStats.summary.userRetentionRate.toFixed(1)}%</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Trung bình {userStats.summary.averageCoursesPerUser.toFixed(1)} khóa học/người dùng
                    </p>
                </div>
            </div>

            {/* Người dùng theo tháng */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
                <h2 className="text-lg font-bold mb-4">Thống kê người dùng theo tháng</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tháng
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Người dùng mới
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Người dùng hoạt động
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tổng người dùng
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tỷ lệ hoạt động
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {userStats.usersByMonth.map((month: UsersByMonth, index: number) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {month.month}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {month.newUsers}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {month.activeUsers}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {month.totalUsers}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {((month.activeUsers / month.totalUsers) * 100).toFixed(1)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top người dùng */}
            <div className="bg-white shadow rounded-lg p-4 mb-6">
                <h2 className="text-lg font-bold mb-4">Top 10 người dùng tích cực nhất</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Người dùng
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khóa học đã đăng ký
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tổng chi tiêu
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hoạt động gần nhất
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {userStats.topUsers.map((user: TopUser, index: number) => (
                                <tr key={user.userId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 relative">
                                                <img
                                                    src={user.avatar || '/images/placeholder-avatar.jpg'}
                                                    alt=""
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    <Link href={`/admin/users/details/${user.userId}`} className="hover:underline">
                                                        {user.userName}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.coursesEnrolled}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {formatCurrency(user.totalSpent)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(user.lastActive)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Nút điều hướng */}
            <div className="flex justify-between mt-8">
                <Link
                    href="/admin/statistics"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Quay lại tổng quan
                </Link>
                <Link
                    href="/admin/users"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Quản lý người dùng
                </Link>
            </div>
        </div>
    );
} 