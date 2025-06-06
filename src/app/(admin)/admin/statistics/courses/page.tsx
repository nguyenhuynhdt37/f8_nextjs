import React from 'react';
import Link from 'next/link';
import axiosInstance from '@/api/axios/axiosInstance';

// Định nghĩa kiểu dữ liệu
interface CourseStats {
    courseId: number;
    courseTitle: string;
    revenue: number;
    enrollmentCount: number;
    level: string;
    createdAt: string;
    lastPurchaseDate: string;
    avgRating: number;
    categoryName: string;
}

// Server-side data fetching function
async function fetchCourseStatistics() {
    try {
        const res = await axiosInstance.get('/statistics/courses');
        return res.data.data || [];
    } catch (error) {
        console.error('Error fetching course statistics:', error);
        return [];
    }
}

export default async function CourseStatisticsPage() {
    const courseStats = await fetchCourseStatistics();

    // Utility function for formatting currency
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Utility function for formatting date
    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Thống kê khóa học</h1>
                <Link
                    href="/admin/statistics"
                    className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300 text-sm"
                >
                    Quay lại
                </Link>
            </div>

            <div className="bg-white shadow rounded-lg p-4 mb-6">
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Tổng số khóa học</p>
                        <p className="text-xl font-bold">{courseStats.length}</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Tổng doanh thu</p>
                        <p className="text-xl font-bold">
                            {formatCurrency(courseStats.reduce((sum: number, course: CourseStats) => sum + (course.revenue || 0), 0))}
                        </p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Tổng lượt đăng ký</p>
                        <p className="text-xl font-bold">
                            {courseStats.reduce((sum: number, course: CourseStats) => sum + (course.enrollmentCount || 0), 0)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khóa học
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Danh mục
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cấp độ
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đăng ký
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doanh thu
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Đánh giá
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ngày tạo
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Lần mua cuối
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {courseStats.map((course: CourseStats) => (
                                <tr key={course.courseId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Link
                                            href={`/admin/course/edit/${course.courseId}`}
                                            className="text-blue-600 hover:underline font-medium"
                                        >
                                            {course.courseTitle}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {course.categoryName || 'Không có'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {course.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {course.enrollmentCount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {formatCurrency(course.revenue)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {course.avgRating ? `${course.avgRating.toFixed(1)} ⭐` : 'Chưa có'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {course.createdAt ? formatDate(course.createdAt) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {course.lastPurchaseDate ? formatDate(course.lastPurchaseDate) : 'Chưa có'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 