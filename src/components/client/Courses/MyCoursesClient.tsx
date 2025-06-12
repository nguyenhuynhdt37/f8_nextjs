'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMyCoursesAsync } from '@/api/axios/api';
import { FiSearch, FiArrowUp, FiArrowDown, FiGrid, FiList, FiStar, FiBookmark } from 'react-icons/fi';
import { TbProgress } from 'react-icons/tb';
import { MdOutlineAccessTime, MdOutlineOndemandVideo } from 'react-icons/md';
import { IoRocketOutline, IoStatsChartOutline, IoBookOutline } from 'react-icons/io5';
import { useTheme } from '@/context/ThemeContext';

import { motion, AnimatePresence } from 'framer-motion';

interface EnrolledCourse {
    enrollment: {
        id: number;
        enrolledAt: string;
        completionStatus: number | null;
    };
    course: {
        id: number;
        title: string;
        banner: string | null;
        isActive: boolean;
    };
}

interface Pagination {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

const MyCoursesClient = () => {
    const [courses, setCourses] = useState<EnrolledCourse[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState('EnrolledAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filteredCourses, setFilteredCourses] = useState<EnrolledCourse[]>([]);
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const router = useRouter();
    const [courseStats, setCourseStats] = useState({
        totalCourses: 0,
        completedCourses: 0,
        averageCompletion: 0
    });

    const fetchCourses = async (page = 1, pageSize = 12) => {
        setLoading(true);
        try {
            const response = await getMyCoursesAsync(page, pageSize, sortField, sortOrder);
            if (response.statusCode === 200 && response.data) {
                setCourses(response.data.courses);
                setFilteredCourses(response.data.courses);
                setPagination(response.data.pagination);
            } else {
                setError(response.message || 'Không thể lấy danh sách khóa học');
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setError('Đã xảy ra lỗi khi tải khóa học. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, [sortField, sortOrder]);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredCourses(courses);
        } else {
            const filtered = courses.filter(course =>
                course.course.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredCourses(filtered);
        }
    }, [searchTerm, courses]);

    useEffect(() => {
        if (courses.length > 0) {
            const completedCourses = courses.filter(c => (c.enrollment.completionStatus || 0) >= 100).length;
            const totalCompletionPercentage = courses.reduce((acc, c) => acc + (c.enrollment.completionStatus || 0), 0);
            const averageCompletion = Math.round(totalCompletionPercentage / courses.length);

            setCourseStats({
                totalCourses: courses.length,
                completedCourses,
                averageCompletion
            });
        }
    }, [courses]);

    const handlePageChange = (page: number) => {
        if (pagination) {
            fetchCourses(page, pagination.pageSize);
        }
    };

    const handleSort = (field: string) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('desc');
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleCourseClick = (courseId: number) => {
        router.push(`/courses/${courseId}`);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const getProgressColor = (progress: number | null) => {
        const percent = progress || 0;
        if (percent < 30) return 'bg-red-500 dark:bg-red-600';
        if (percent < 70) return 'bg-amber-500 dark:bg-amber-600';
        return 'bg-emerald-500 dark:bg-emerald-600';
    };

    const getSortTooltip = (field: string) => {
        if (sortField === field) {
            return sortOrder === 'asc' ? 'Đang sắp xếp tăng dần' : 'Đang sắp xếp giảm dần';
        }
        return `Nhấn để sắp xếp theo ${field === 'EnrolledAt' ? 'ngày đăng ký' : 'tiến độ'}`;
    };

    const renderEmptyState = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full py-16 text-center"
        >
            <div className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <IoRocketOutline className="w-20 h-20 mx-auto mb-4" />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Hành trình học tập của bạn chưa bắt đầu
            </h3>
            <p className={`text-base mb-6 max-w-md mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Khám phá và đăng ký các khóa học để nâng cao kỹ năng của bạn. Hàng trăm khóa học chất lượng đang chờ đợi!
            </p>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/courses')}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
                Khám phá khóa học
            </motion.button>
        </motion.div>
    );

    const renderStatsSection = () => {
        if (courses.length === 0) return null;

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
            >
                <motion.div
                    whileHover={{ y: -5 }}
                    className={`flex items-center p-5 rounded-xl ${isDarkMode
                        ? 'bg-gradient-to-r from-gray-800 to-gray-700'
                        : 'bg-gradient-to-r from-blue-50 to-indigo-50'
                        }`}
                >
                    <div className={`p-3 rounded-full mr-4 ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                        }`}>
                        <IoBookOutline className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium opacity-80">Khóa học đang học</h3>
                        <p className="text-2xl font-bold">{courseStats.totalCourses}</p>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className={`flex items-center p-5 rounded-xl ${isDarkMode
                        ? 'bg-gradient-to-r from-gray-800 to-gray-700'
                        : 'bg-gradient-to-r from-green-50 to-emerald-50'
                        }`}
                >
                    <div className={`p-3 rounded-full mr-4 ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'
                        }`}>
                        <FiBookmark className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium opacity-80">Khóa học hoàn thành</h3>
                        <p className="text-2xl font-bold">{courseStats.completedCourses}</p>
                    </div>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className={`flex items-center p-5 rounded-xl ${isDarkMode
                        ? 'bg-gradient-to-r from-gray-800 to-gray-700'
                        : 'bg-gradient-to-r from-purple-50 to-indigo-50'
                        }`}
                >
                    <div className={`p-3 rounded-full mr-4 ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
                        }`}>
                        <IoStatsChartOutline className="text-2xl" />
                    </div>
                    <div>
                        <h3 className="text-sm font-medium opacity-80">Tiến độ trung bình</h3>
                        <p className="text-2xl font-bold">{courseStats.averageCompletion}%</p>
                    </div>
                </motion.div>
            </motion.div>
        );
    };

    const HighCompletionBadge = ({ completionStatus }: { completionStatus: number | null }) => {
        if (!completionStatus || completionStatus < 80) return null;

        return (
            <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.7
                }}
                className="absolute top-3 right-3 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
            >
                <div className="flex items-center space-x-1">
                    <FiStar className="text-yellow-200" />
                    <span>{completionStatus}% Hoàn thành</span>
                </div>
            </motion.div>
        );
    };

    const renderGridView = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <AnimatePresence mode="wait">
                {filteredCourses.map((item, index) => (
                    <motion.div
                        key={item.enrollment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                        onClick={() => handleCourseClick(item.course.id)}
                        className={`group rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl ${isDarkMode
                            ? 'bg-gray-800 border border-gray-700 shadow-lg hover:shadow-indigo-500/20'
                            : 'bg-white border border-gray-200 shadow-md hover:shadow-indigo-500/30'
                            }`}
                    >
                        <div className="relative h-48 w-full overflow-hidden">
                            <img
                                src={item.course.banner || '/images/course-default.png'}
                                alt={item.course.title}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>

                            <HighCompletionBadge completionStatus={item.enrollment.completionStatus} />

                            {!item.course.isActive && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-white font-medium px-3 py-1 bg-red-500/80 rounded-md">
                                        Khóa học không khả dụng
                                    </span>
                                </div>
                            )}

                            <div className="absolute bottom-3 left-3 right-3">
                                <div className="flex justify-between items-center text-white">
                                    <div className="flex items-center text-xs space-x-2">
                                        <MdOutlineAccessTime className="text-lg" />
                                        <span>Đăng ký: {formatDate(item.enrollment.enrolledAt)}</span>
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center text-xs bg-indigo-600/80 px-2 py-1 rounded-md backdrop-blur-sm"
                                    >
                                        <MdOutlineOndemandVideo className="mr-1" />
                                        <span>Học ngay</span>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className={`font-bold text-lg mb-2 line-clamp-2 group-hover:text-indigo-500 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'
                                }`}>
                                {item.course.title}
                            </h3>

                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Tiến độ học tập
                                    </span>
                                    <span className={`text-sm font-bold ${(item.enrollment.completionStatus || 0) > 80
                                        ? 'text-emerald-500'
                                        : (item.enrollment.completionStatus || 0) > 30
                                            ? 'text-amber-500'
                                            : isDarkMode ? 'text-gray-300' : 'text-gray-800'
                                        }`}>
                                        {item.enrollment.completionStatus || 0}%
                                    </span>
                                </div>
                                <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.enrollment.completionStatus || 0}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-2 rounded-full ${getProgressColor(item.enrollment.completionStatus)}`}
                                    ></motion.div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );

    const renderListView = () => (
        <div className="mt-6 space-y-4">
            <AnimatePresence mode="wait">
                {filteredCourses.map((item, index) => (
                    <motion.div
                        key={item.enrollment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        onClick={() => handleCourseClick(item.course.id)}
                        className={`group flex flex-col sm:flex-row rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isDarkMode
                            ? 'bg-gray-800 border border-gray-700 shadow-lg'
                            : 'bg-white border border-gray-200 shadow-md'
                            }`}
                    >
                        <div className="relative h-48 sm:h-auto sm:w-60 flex-shrink-0">
                            <img
                                src={item.course.banner || '/images/course-default.png'}
                                alt={item.course.title}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />
                            {!item.course.isActive && (
                                <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-white font-medium px-3 py-1 bg-red-500/80 rounded-md">
                                        Khóa học không khả dụng
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className={`font-bold text-lg mb-2 group-hover:text-indigo-500 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'
                                    }`}>
                                    {item.course.title}
                                </h3>

                                <div className="flex items-center text-xs mb-4">
                                    <MdOutlineAccessTime className={`mr-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                        Đăng ký: {formatDate(item.enrollment.enrolledAt)}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Tiến độ học tập
                                    </span>
                                    <span className={`text-sm font-bold ${(item.enrollment.completionStatus || 0) > 80
                                        ? 'text-emerald-500'
                                        : (item.enrollment.completionStatus || 0) > 30
                                            ? 'text-amber-500'
                                            : isDarkMode ? 'text-gray-300' : 'text-gray-800'
                                        }`}>
                                        {item.enrollment.completionStatus || 0}%
                                    </span>
                                </div>
                                <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${item.enrollment.completionStatus || 0}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className={`h-2 rounded-full ${getProgressColor(item.enrollment.completionStatus)}`}
                                    ></motion.div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    className="mt-4 w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors"
                                >
                                    <MdOutlineOndemandVideo />
                                    <span>Tiếp tục học</span>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 py-8"
            >
                <div className="flex justify-between items-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`text-3xl font-extrabold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                            Khóa học của tôi
                        </span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="flex items-center space-x-3"
                    >
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'grid'
                                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <FiGrid className="text-lg" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-md transition-all ${viewMode === 'list'
                                    ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300'
                                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <FiList className="text-lg" />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {renderStatsSection()}

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
                >
                    <form onSubmit={handleSearch} className="w-full md:w-1/2 lg:w-1/3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm khóa học..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`w-full py-2.5 pl-10 pr-4 text-sm rounded-lg focus:outline-none focus:ring-2 transition-colors ${isDarkMode
                                    ? 'bg-gray-800 border border-gray-700 text-white focus:ring-indigo-500 placeholder-gray-400'
                                    : 'bg-white border border-gray-300 text-gray-900 focus:ring-indigo-500 placeholder-gray-500'
                                    }`}
                            />
                            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                        </div>
                    </form>

                    <div className="flex gap-4 w-full md:w-auto">
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="relative group"
                        >
                            <button
                                onClick={() => handleSort('EnrolledAt')}
                                className={`flex items-center space-x-1 px-3 py-2 text-sm rounded-lg transition-colors ${isDarkMode
                                    ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                title={getSortTooltip('EnrolledAt')}
                            >
                                <span>Ngày đăng ký</span>
                                {sortField === 'EnrolledAt' && (
                                    sortOrder === 'asc'
                                        ? <FiArrowUp className="text-indigo-500 ml-2" />
                                        : <FiArrowDown className="text-indigo-500 ml-2" />
                                )}
                            </button>
                            <AnimatePresence>
                                {sortField === 'EnrolledAt' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className={`absolute -top-2 -right-2 w-2 h-2 rounded-full ${sortOrder === 'asc' ? 'bg-amber-500' : 'bg-indigo-500'}`}
                                    ></motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -2 }}
                            className="relative group"
                        >
                            <button
                                onClick={() => handleSort('CompletionStatus')}
                                className={`flex items-center space-x-1 px-3 py-2 text-sm rounded-lg transition-colors ${isDarkMode
                                    ? 'bg-gray-800 border border-gray-700 text-white hover:bg-gray-700'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                title={getSortTooltip('CompletionStatus')}
                            >
                                <span>Tiến độ</span>
                                {sortField === 'CompletionStatus' && (
                                    sortOrder === 'asc'
                                        ? <FiArrowUp className="text-indigo-500 ml-2" />
                                        : <FiArrowDown className="text-indigo-500 ml-2" />
                                )}
                            </button>
                            <AnimatePresence>
                                {sortField === 'CompletionStatus' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        className={`absolute -top-2 -right-2 w-2 h-2 rounded-full ${sortOrder === 'asc' ? 'bg-amber-500' : 'bg-indigo-500'}`}
                                    ></motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </motion.div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="relative w-16 h-16">
                            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-indigo-500 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin"></div>
                            <div className="absolute top-2 left-2 w-12 h-12 rounded-full border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent animate-spin"></div>
                        </div>
                    </div>
                ) : error ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-red-50 text-red-600 border border-red-200'
                            }`}
                    >
                        {error}
                    </motion.div>
                ) : (
                    <>
                        {filteredCourses.length === 0 ? renderEmptyState() : (
                            viewMode === 'grid' ? renderGridView() : renderListView()
                        )}

                        {pagination && pagination.totalPages > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="flex justify-center mt-10"
                            >
                                <nav className={`rounded-lg inline-flex shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <ul className="flex items-center">
                                        <li>
                                            <button
                                                onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
                                                disabled={pagination.currentPage === 1}
                                                className={`rounded-l-lg px-4 py-2 border-r transition-colors ${pagination.currentPage === 1
                                                    ? isDarkMode ? 'text-gray-600 border-gray-700 cursor-not-allowed' : 'text-gray-400 border-gray-200 cursor-not-allowed'
                                                    : isDarkMode ? 'text-gray-300 border-gray-700 hover:bg-gray-700' : 'text-gray-700 border-gray-200 hover:bg-gray-100'
                                                    }`}
                                            >
                                                Trước
                                            </button>
                                        </li>

                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                                            <li key={page}>
                                                <button
                                                    onClick={() => handlePageChange(page)}
                                                    className={`w-10 h-10 flex items-center justify-center border-r transition-colors ${pagination.currentPage === page
                                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                                        : isDarkMode
                                                            ? 'text-gray-300 border-gray-700 hover:bg-gray-700'
                                                            : 'text-gray-700 border-gray-200 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            </li>
                                        ))}

                                        <li>
                                            <button
                                                onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
                                                disabled={pagination.currentPage === pagination.totalPages}
                                                className={`rounded-r-lg px-4 py-2 transition-colors ${pagination.currentPage === pagination.totalPages
                                                    ? isDarkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                                                    : isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                Tiếp
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </motion.div>
                        )}
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default MyCoursesClient; 