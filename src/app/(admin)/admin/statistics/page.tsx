import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import axiosInstance from '@/api/axios/axiosInstance';

// Định nghĩa các interface cho dữ liệu
interface DashboardStats {
    totalUsers: number;
    totalCourses: number;
    totalRevenue: number;
    totalEnrollments: number;
    newUsersThisMonth: number;
    newCoursesThisMonth: number;
    enrollmentsThisMonth: number;
}

interface RevenueSummary {
    totalRevenue: number;
    todayRevenue: number;
    weekRevenue: number;
    monthRevenue: number;
    yearRevenue: number;
    growthRateMonth: number;
    growthRateYear: number;
}

interface CourseStats {
    courseId: number;
    courseTitle: string;
    revenue: number;
    enrollmentCount: number;
}

interface UserStats {
    userId: number;
    userName: string;
    email: string;
    avatar: string;
    coursesEnrolled: number;
}

interface TopPerformers {
    topCourses: CourseStats[];
    mostActiveUsers: UserStats[];
}

interface StatisticsData {
    dashboardStats: DashboardStats | null;
    revenueSummary: RevenueSummary | null;
    topCourses: CourseStats[];
    topPerformers: TopPerformers | null;
}

// Server-side data fetching function
async function fetchStatisticsData(): Promise<StatisticsData> {
    try {
        // Fetch all statistics data in parallel
        const [dashboardData, revenueData, coursesData, performersData] = await Promise.all([
            axiosInstance.get('/statistics/dashboard'),
            axiosInstance.get('/statistics/revenue/summary'),
            axiosInstance.get('/statistics/top-courses', { params: { count: 5, metric: 'revenue' } }),
            axiosInstance.get('/statistics/top-performers', { params: { count: 5 } })
        ]);

        return {
            dashboardStats: dashboardData.data.data,
            revenueSummary: revenueData.data.data,
            topCourses: coursesData.data.data,
            topPerformers: performersData.data.data
        };
    } catch (error) {
        console.error('Error fetching statistics:', error);
        return {
            dashboardStats: null,
            revenueSummary: null,
            topCourses: [],
            topPerformers: null
        };
    }
}

export default async function StatisticsDashboard() {
    const { dashboardStats, revenueSummary, topCourses, topPerformers } = await fetchStatisticsData();

    // Utility function for formatting currency
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Thống kê tổng quan</h1>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">Tổng người dùng</h3>
                        <span className="text-gray-500">👤</span>
                    </div>
                    <div className="text-2xl font-bold">{dashboardStats?.totalUsers || 0}</div>
                    <p className="text-xs text-gray-500">
                        {dashboardStats?.newUsersThisMonth || 0} mới tháng này
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">Tổng khóa học</h3>
                        <span className="text-gray-500">📚</span>
                    </div>
                    <div className="text-2xl font-bold">{dashboardStats?.totalCourses || 0}</div>
                    <p className="text-xs text-gray-500">
                        {dashboardStats?.newCoursesThisMonth || 0} mới tháng này
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">Tổng doanh thu</h3>
                        <span className="text-gray-500">💰</span>
                    </div>
                    <div className="text-2xl font-bold">{formatCurrency(revenueSummary?.totalRevenue || 0)}</div>
                    <div className="flex items-center text-xs text-gray-500">
                        {(revenueSummary?.growthRateMonth ?? 0) > 0 ? (
                            <span className="text-green-500">↗ {(revenueSummary?.growthRateMonth ?? 0).toFixed(1)}%</span>
                        ) : (
                            <span>↘ {(revenueSummary?.growthRateMonth ?? 0).toFixed(1)}%</span>
                        )}
                        <span className="ml-1">so với tháng trước</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-medium">Tổng đăng ký</h3>
                        <span className="text-gray-500">📝</span>
                    </div>
                    <div className="text-2xl font-bold">{dashboardStats?.totalEnrollments || 0}</div>
                    <p className="text-xs text-gray-500">
                        {dashboardStats?.enrollmentsThisMonth || 0} đăng ký mới tháng này
                    </p>
                </div>
            </div>

            {/* Revenue Overview */}
            <div className="bg-white rounded-lg shadow p-4 mb-8">
                <h2 className="text-xl font-bold mb-4">Doanh thu theo thời gian</h2>
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-sm font-medium mb-2">Hôm nay</h3>
                        <p className="text-lg font-bold">{formatCurrency(revenueSummary?.todayRevenue || 0)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-sm font-medium mb-2">Tuần này</h3>
                        <p className="text-lg font-bold">{formatCurrency(revenueSummary?.weekRevenue || 0)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-sm font-medium mb-2">Tháng này</h3>
                        <p className="text-lg font-bold">{formatCurrency(revenueSummary?.monthRevenue || 0)}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <h3 className="text-sm font-medium mb-2">Năm nay</h3>
                        <p className="text-lg font-bold">{formatCurrency(revenueSummary?.yearRevenue || 0)}</p>
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Tỷ lệ tăng trưởng</h3>
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Tháng</p>
                            <p className={`text-lg font-bold ${(revenueSummary?.growthRateMonth ?? 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {(revenueSummary?.growthRateMonth ?? 0) > 0 ? '+' : ''}
                                {(revenueSummary?.growthRateMonth ?? 0).toFixed(1)}%
                            </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-500">Năm</p>
                            <p className={`text-lg font-bold ${(revenueSummary?.growthRateYear ?? 0) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {(revenueSummary?.growthRateYear ?? 0) > 0 ? '+' : ''}
                                {(revenueSummary?.growthRateYear ?? 0).toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Courses and Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-bold mb-2">Khóa học bán chạy nhất</h2>
                    <p className="text-sm text-gray-500 mb-4">Top 5 khóa học có doanh thu cao nhất</p>

                    <div className="space-y-4">
                        {topCourses?.map((course: CourseStats, index: number) => (
                            <div key={course.courseId} className="flex items-center space-x-4">
                                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
                                    <span className="font-bold text-sm">{index + 1}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/admin/course/edit/${course.courseId}`} className="text-sm font-medium hover:underline truncate block">
                                        {course.courseTitle}
                                    </Link>
                                    <p className="text-xs text-gray-500">{formatCurrency(course.revenue)}</p>
                                </div>
                                <div className="text-sm">{course.enrollmentCount} học viên</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <Link
                            href="/admin/statistics/courses"
                            className="text-sm text-blue-600 flex items-center hover:underline"
                        >
                            Xem tất cả khóa học →
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-bold mb-2">Người dùng tích cực nhất</h2>
                    <p className="text-sm text-gray-500 mb-4">Top 5 người dùng đăng ký nhiều khóa học nhất</p>

                    <div className="space-y-4">
                        {topPerformers?.mostActiveUsers?.map((user: UserStats, index: number) => (
                            <div key={user.userId} className="flex items-center space-x-4">
                                <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center">
                                    <span className="font-bold text-sm">{index + 1}</span>
                                </div>
                                <div className="relative w-8 h-8">
                                    <img
                                        src={user.avatar || '/images/placeholder-avatar.jpg'}
                                        alt={user.userName}
                                        className="rounded-full object-cover w-full h-full"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <Link href={`/admin/users/details/${user.userId}`} className="text-sm font-medium hover:underline truncate block">
                                        {user.userName}
                                    </Link>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <div className="text-sm">{user.coursesEnrolled} khóa học</div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4">
                        <Link
                            href="/admin/statistics/users"
                            className="text-sm text-blue-600 flex items-center hover:underline"
                        >
                            Xem tất cả người dùng →
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-between items-center">
                <Link
                    href="/admin/statistics/courses"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Thống kê khóa học
                </Link>
                <Link
                    href="/admin/statistics/revenue"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Thống kê doanh thu
                </Link>
                <Link
                    href="/admin/statistics/users"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Thống kê người dùng
                </Link>
            </div>
        </div>
    );
} 