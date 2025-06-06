'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MdOutlineDashboard,
  MdBarChart,
  MdPeople,
  MdPlayLesson,
  MdTrendingUp,
  MdCalendarToday,
  MdOutlineWatchLater,
  MdDateRange
} from 'react-icons/md';
import { BsBook, BsCreditCard2Front, BsArrowUpShort, BsArrowDownShort } from 'react-icons/bs';
import { FaGraduationCap } from 'react-icons/fa';
import { getDashboardStatistics, getRevenuePeriods, getTopCourses, getGrowthComparison, getMonthlyRevenue } from '@/api/axios/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useTheme } from '@/context/ThemeContext';
import { FiUsers, FiBookOpen, FiDollarSign, FiActivity } from 'react-icons/fi';
import { HiOutlineDocumentText, HiOutlineAcademicCap } from 'react-icons/hi';
import { MdOutlineSchool } from 'react-icons/md';

// Đăng ký các components cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Định nghĩa interface cho dữ liệu thống kê
interface DashboardStats {
  totalUsers: number;
  totalCourses: number;
  totalLessons: number;
  totalRevenue: number;
  totalEnrollments: number;
  activeUsers: number;
  todaySignups: number;
  coursesCompletedLast24h: number;
  averageStudyTimePerUser: number;
  revenueThisMonth?: number;
  statsGrowth: {
    label: string;
    value: string;
    isPositive: boolean;
  }[];
  recentTransactions: {
    id: number;
    user: string;
    course: string;
    amount: number;
    date: string;
    status: string;
  }[];
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Format currency in VND
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Format date in Vietnamese format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Mock data for the dashboard
const mockData = {
  totalUsers: 8745,
  totalCourses: 142,
  totalRevenue: 254780000,
  totalEnrollments: 12458,
  totalPosts: 387,
  completionRate: 78,
  activeUsers: 3245,
  recentActivity: [
    { id: 1, user: 'Nguyễn Văn A', action: 'đăng ký khóa học', target: 'ReactJS Nâng Cao', time: '5 phút trước', avatar: '/images/avatar1.jpg' },
    { id: 2, user: 'Trần Thị B', action: 'hoàn thành khóa học', target: 'JavaScript Cơ Bản', time: '15 phút trước', avatar: '/images/avatar2.jpg' },
    { id: 3, user: 'Lê Văn C', action: 'đăng bài viết mới', target: 'Tìm hiểu về NextJS 13', time: '30 phút trước', avatar: '/images/avatar3.jpg' },
    { id: 4, user: 'Phạm Thị D', action: 'thanh toán khóa học', target: 'NodeJS và ExpressJS', time: '1 giờ trước', avatar: '/images/avatar4.jpg' },
    { id: 5, user: 'Hoàng Văn E', action: 'đánh giá 5 sao', target: 'Khóa học Python', time: '2 giờ trước', avatar: '/images/avatar5.jpg' },
  ],
  popularCourses: [
    { id: 1, name: 'ReactJS Nâng Cao', students: 1245, completion: 82, revenue: 45600000 },
    { id: 2, name: 'JavaScript Cơ Bản', students: 2130, completion: 76, revenue: 38700000 },
    { id: 3, name: 'NodeJS và ExpressJS', students: 987, completion: 68, revenue: 29800000 },
    { id: 4, name: 'Python cho người mới bắt đầu', students: 1567, completion: 74, revenue: 35200000 },
  ]
};

const DashBoard = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [periodType, setPeriodType] = useState<string>('month');
  const [growthData, setGrowthData] = useState<any>(null);
  const [isGrowthLoading, setIsGrowthLoading] = useState(true);
  const [revenueChartData, setRevenueChartData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch dashboard statistics
        const dashboardRes = await getDashboardStatistics();

        console.log('Dashboard API response:', dashboardRes);

        if (dashboardRes && dashboardRes.statusCode === 200 && dashboardRes.data) {
          // Kiểm tra và log dữ liệu chi tiết
          console.log('Dashboard data details:', {
            totalUsers: dashboardRes.data.totalUsers,
            totalCourses: dashboardRes.data.totalCourses,
            totalLessons: dashboardRes.data.totalLessons,
            totalRevenue: dashboardRes.data.totalRevenue,
            totalEnrollments: dashboardRes.data.totalEnrollments,
            activeUsers: dashboardRes.data.activeUsers,
            userGrowthRate: dashboardRes.data.userGrowthRate,
            courseGrowthRate: dashboardRes.data.courseGrowthRate,
            revenueGrowthRate: dashboardRes.data.revenueGrowthRate,
            studyTimeGrowthRate: dashboardRes.data.studyTimeGrowthRate,
            recentTransactions: dashboardRes.data.recentTransactions
          });

          // Kiểm tra cấu trúc dữ liệu recentTransactions và hiển thị status chi tiết hơn
          if (Array.isArray(dashboardRes.data.recentTransactions) && dashboardRes.data.recentTransactions.length > 0) {
            console.log('Sample transaction object:', dashboardRes.data.recentTransactions[0]);
            console.log('All transaction statuses:', dashboardRes.data.recentTransactions.map((tx: any) => tx.status));
          }

          // Transform API data to match our component structure
          const transformedData: DashboardStats = {
            totalUsers: dashboardRes.data.totalUsers || 0,
            totalCourses: dashboardRes.data.totalCourses || 0,
            totalLessons: dashboardRes.data.totalLessons || 0,
            totalRevenue: dashboardRes.data.totalRevenue || 0,
            totalEnrollments: dashboardRes.data.totalEnrollments || 0,
            activeUsers: dashboardRes.data.activeUsers || 0,
            todaySignups: dashboardRes.data.todaySignups || 0,
            coursesCompletedLast24h: dashboardRes.data.coursesCompletedLast24h || 0,
            averageStudyTimePerUser: dashboardRes.data.averageStudyTimePerUser || 0,
            revenueThisMonth: dashboardRes.data.revenueThisMonth || 0,
            statsGrowth: [
              {
                label: "Người dùng",
                value: `${(dashboardRes.data.userGrowthRate || 0) > 0 ? '+' : ''}${(dashboardRes.data.userGrowthRate || 0).toFixed(1)}%`,
                isPositive: (dashboardRes.data.userGrowthRate || 0) > 0
              },
              {
                label: "Khóa học",
                value: `${(dashboardRes.data.courseGrowthRate || 0) > 0 ? '+' : ''}${(dashboardRes.data.courseGrowthRate || 0).toFixed(1)}%`,
                isPositive: (dashboardRes.data.courseGrowthRate || 0) > 0
              },
              {
                label: "Doanh thu",
                value: `${(dashboardRes.data.revenueGrowthRate || 0) > 0 ? '+' : ''}${(dashboardRes.data.revenueGrowthRate || 0).toFixed(1)}%`,
                isPositive: (dashboardRes.data.revenueGrowthRate || 0) > 0
              },
              {
                label: "Thời gian học",
                value: `${(dashboardRes.data.studyTimeGrowthRate || 0) > 0 ? '+' : ''}${(dashboardRes.data.studyTimeGrowthRate || 0).toFixed(1)}%`,
                isPositive: (dashboardRes.data.studyTimeGrowthRate || 0) > 0
              }
            ],
            recentTransactions: Array.isArray(dashboardRes.data.recentTransactions) ? dashboardRes.data.recentTransactions : []
          };

          setData(transformedData);
        } else {
          console.error('API response error:', dashboardRes);
          setError(dashboardRes?.message || 'Không thể tải dữ liệu từ API');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchGrowthData = async () => {
      setIsGrowthLoading(true);
      try {
        console.log('Fetching growth data with period:', periodType);
        const response = await getGrowthComparison(periodType);
        console.log('Growth data response:', response);

        if (response?.statusCode === 200 && response.data) {
          // Log dữ liệu chi tiết và kiểu dữ liệu
          console.log('Growth data detail:', {
            current: response.data.current,
            previous: response.data.previous,
            growth: response.data.growth
          });

          console.log('Growth data types:', {
            usersGrowth: typeof response.data.growth.users,
            coursesGrowth: typeof response.data.growth.courses,
            revenueGrowth: typeof response.data.growth.revenue,
            enrollmentsGrowth: typeof response.data.growth.enrollments
          });

          // Đảm bảo các giá trị tăng trưởng luôn là số
          const processedData = {
            ...response.data,
            growth: {
              users: Number(response.data.growth.users),
              courses: Number(response.data.growth.courses),
              revenue: Number(response.data.growth.revenue),
              enrollments: Number(response.data.growth.enrollments)
            }
          };

          setGrowthData(processedData);
        } else {
          console.error('API response error:', response);
        }
      } catch (err) {
        console.error('Error fetching growth data:', err);
      } finally {
        setIsGrowthLoading(false);
      }
    };

    fetchGrowthData();
  }, [periodType]);

  // Log để debug dữ liệu tăng trưởng
  useEffect(() => {
    if (growthData) {
      console.log('Current growth data in component:', {
        users: growthData.growth.users,
        courses: growthData.growth.courses,
        revenue: growthData.growth.revenue,
        enrollments: growthData.growth.enrollments
      });

      console.log('Growth data types:', {
        usersType: typeof growthData.growth.users,
        coursesType: typeof growthData.growth.courses,
        revenueType: typeof growthData.growth.revenue,
        enrollmentsType: typeof growthData.growth.enrollments
      });

      // Kiểm tra sau khi chuyển đổi số
      console.log('Growth after Number() conversion:', {
        users: Number(growthData.growth.users),
        courses: Number(growthData.growth.courses),
        revenue: Number(growthData.growth.revenue),
        enrollments: Number(growthData.growth.enrollments)
      });
    }
  }, [growthData]);

  // Tạo dữ liệu biểu đồ doanh thu theo tháng
  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      try {
        // Lấy dữ liệu doanh thu theo tháng từ API
        const response = await getMonthlyRevenue();
        console.log('Monthly revenue response:', response);

        if (response?.statusCode === 200 && response.data) {
          // Tạo dữ liệu biểu đồ từ dữ liệu API
          const monthlyData = response.data.monthlyData || [];
          const labels = monthlyData.map((item: { month: string }) => item.month + '/' + response.data.year);
          const revenueData = monthlyData.map((item: { revenue: number }) => item.revenue);

          const chartData = {
            labels: labels,
            datasets: [
              {
                label: 'Doanh thu (VNĐ)',
                data: revenueData,
                backgroundColor: 'rgba(79, 70, 229, 0.6)',
                borderColor: 'rgba(79, 70, 229, 1)',
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
              },
              title: {
                display: true,
                text: 'Doanh thu theo tháng (VNĐ)',
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
                  callback: function (value: any) {
                    if (value >= 1000000) {
                      return (value / 1000000) + 'M';
                    }
                    return value / 1000;
                  }
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
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="relative w-20 h-20">
          <div className={`animate-ping absolute inset-0 rounded-full ${isDark ? 'bg-blue-400' : 'bg-blue-500'} opacity-75`}></div>
          <div className={`relative rounded-full w-20 h-20 ${isDark ? 'bg-blue-500' : 'bg-blue-600'} flex items-center justify-center`}>
            <svg className="w-10 h-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
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
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-8">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}
        >
          Tổng quan hệ thống
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
        >
          <span className="font-medium">Hôm nay:</span> {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </motion.div>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants} className="dashboard-card">
          <div className={`stat-card ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
            <div className={`stat-icon ${isDark ? 'bg-blue-900/50' : 'bg-blue-100'} ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
              <FiUsers size={24} />
            </div>
            <div className="stat-content">
              <div className={`stat-value ${isDark ? 'text-white' : 'text-gray-800'}`}>{mockData.totalUsers.toLocaleString()}</div>
              <div className="stat-label">Người dùng</div>
              <div className="flex items-center mt-2 text-xs">
                <span className="flex items-center text-green-500">
                  <BsArrowUpShort size={16} />
                  12.5%
                </span>
                <span className="ml-2 text-gray-500">so với tháng trước</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="dashboard-card">
          <div className={`stat-card ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
            <div className={`stat-icon ${isDark ? 'bg-green-900/50' : 'bg-green-100'} ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              <FiBookOpen size={24} />
            </div>
            <div className="stat-content">
              <div className={`stat-value ${isDark ? 'text-white' : 'text-gray-800'}`}>{mockData.totalCourses.toLocaleString()}</div>
              <div className="stat-label">Khóa học</div>
              <div className="flex items-center mt-2 text-xs">
                <span className="flex items-center text-green-500">
                  <BsArrowUpShort size={16} />
                  8.2%
                </span>
                <span className="ml-2 text-gray-500">so với tháng trước</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="dashboard-card">
          <div className={`stat-card ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
            <div className={`stat-icon ${isDark ? 'bg-purple-900/50' : 'bg-purple-100'} ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
              <FiDollarSign size={24} />
            </div>
            <div className="stat-content">
              <div className={`stat-value ${isDark ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(mockData.totalRevenue).split('₫')[0]}</div>
              <div className="stat-label">Doanh thu</div>
              <div className="flex items-center mt-2 text-xs">
                <span className="flex items-center text-green-500">
                  <BsArrowUpShort size={16} />
                  15.3%
                </span>
                <span className="ml-2 text-gray-500">so với tháng trước</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="dashboard-card">
          <div className={`stat-card ${isDark ? 'bg-slate-800' : 'bg-white'} shadow-lg`}>
            <div className={`stat-icon ${isDark ? 'bg-amber-900/50' : 'bg-amber-100'} ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
              <MdOutlineSchool size={24} />
            </div>
            <div className="stat-content">
              <div className={`stat-value ${isDark ? 'text-white' : 'text-gray-800'}`}>{mockData.totalEnrollments.toLocaleString()}</div>
              <div className="stat-label">Lượt đăng ký</div>
              <div className="flex items-center mt-2 text-xs">
                <span className="flex items-center text-green-500">
                  <BsArrowUpShort size={16} />
                  9.7%
                </span>
                <span className="ml-2 text-gray-500">so với tháng trước</span>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* Popular Courses */}
        <motion.div
          variants={itemVariants}
          className={`col-span-2 ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Khóa học phổ biến</h2>
            <button className={`text-sm font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
              Xem tất cả
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full admin-table">
              <thead>
                <tr className={`${isDark ? 'bg-slate-700/50 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                  <th className="px-4 py-3 text-left">Tên khóa học</th>
                  <th className="px-4 py-3 text-center">Học viên</th>
                  <th className="px-4 py-3 text-center">Tỷ lệ hoàn thành</th>
                  <th className="px-4 py-3 text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {mockData.popularCourses.map((course, index) => (
                  <tr
                    key={course.id}
                    className={`${isDark ? 'border-t border-slate-700/50' : 'border-t border-gray-100'} ${isDark ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'
                      }`}
                  >
                    <td className={`px-4 py-3 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-md flex items-center justify-center ${['bg-blue-100 text-blue-600', 'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600', 'bg-amber-100 text-amber-600'][index % 4]
                          }`}>
                          <HiOutlineAcademicCap size={16} />
                        </div>
                        <span className="ml-3 font-medium">{course.name}</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-center ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {course.students.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center">
                        <div className="w-full max-w-[120px] bg-gray-200 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                            style={{ width: `${course.completion}%` }}
                          ></div>
                        </div>
                        <span className={`ml-2 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{course.completion}%</span>
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-right ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {formatCurrency(course.revenue).split('₫')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          variants={itemVariants}
          className={`${isDark ? 'bg-slate-800' : 'bg-white'} rounded-xl shadow-lg p-6`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Hoạt động gần đây</h2>
            <button className={`text-sm font-medium ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
              Xem tất cả
            </button>
          </div>

          <div className="space-y-4">
            {mockData.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className={`p-3 rounded-lg ${isDark ? 'hover:bg-slate-700/50' : 'hover:bg-gray-50'} transition-colors`}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                      {activity.user.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                      <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                      <span className={`font-medium ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{activity.target}</span>
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        <motion.div
          variants={itemVariants}
          className={`gradient-border`}
        >
          <div className={`gradient-border-content p-6`}>
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-blue-50'} flex items-center justify-center ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                <HiOutlineDocumentText size={24} />
              </div>
              <div className="ml-4">
                <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Tổng số bài viết</h3>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{mockData.totalPosts.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={`gradient-border`}
        >
          <div className={`gradient-border-content p-6`}>
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-green-50'} flex items-center justify-center ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                <FiActivity size={24} />
              </div>
              <div className="ml-4">
                <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Tỷ lệ hoàn thành</h3>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{mockData.completionRate}%</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className={`gradient-border`}
        >
          <div className={`gradient-border-content p-6`}>
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg ${isDark ? 'bg-slate-700' : 'bg-purple-50'} flex items-center justify-center ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                <FiUsers size={24} />
              </div>
              <div className="ml-4">
                <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Người dùng đang hoạt động</h3>
                <p className={`text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-800'}`}>{mockData.activeUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashBoard;
