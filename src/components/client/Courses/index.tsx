'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiClock, FiBook, FiUsers, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { getAllCourses, getAllCourseByLevel } from '@/api/axios/api';
import { IpageEdit } from '@/types/next-auth';

// Types
interface PaginationInfo {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
}

interface Course {
    course: {
        id: number;
        title: string;
        banner: string;
        introduce: string;
        createdAt: string;
        updatedAt: string;
        isActive: boolean;
        duration: number;
        details: {
            isFree: boolean;
            price: number;
            priceOld: number;
            slogan: string;
        };
        userCourseCounts: number;
        lessonCount: number;
        totalDuration: number;
    };
    level: {
        id: number;
        name: string;
    };
}

interface Level {
    id: number;
    name: string;
}

// CSS styles
const styles = {
    cardHover: "transition-all duration-300",
    courseCard: "",
    courseImage: "transition-transform duration-500",
    badgeGlow: "animate-pulse",
    heroBackground: "bg-gradient-to-r from-blue-500 to-indigo-600",
    gradientText: "bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500",
    floatingElement: "animate-bounce",
    searchInput: "transition-all duration-300",
    filterPanel: "backdrop-filter backdrop-blur-sm",
    paginationItem: "transition-all duration-200",
    paginationActive: "relative overflow-hidden"
};

// Custom hook for fetching data
const useCourses = (
    searchTerm: string,
    sortField: string,
    sortOrder: string,
    levelId: number | null,
    page: number,
    pageSize: number
) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    console.log('courses', courses);

    useEffect(() => {
        const getCourses = async () => {
            setLoading(true);
            try {
                const config: IpageEdit = {
                    searchTerm,
                    sortField,
                    sortOrder,
                    pageNumber: page,
                    pageSize,
                    totalPage: 0,
                    totalCount: 0
                };

                let response;
                if (levelId) {
                    response = await getAllCourseByLevel(levelId);
                } else {
                    response = await getAllCourses({ config });
                }

                if (response.statusCode === 200 && response.data) {
                    setCourses(response.data.courses);
                    setPagination(response.data.pagination);
                } else {
                    setError(response.message || 'Failed to fetch courses');
                    setCourses([]);
                    setPagination(null);
                }
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to fetch courses. Please try again later.');
                setCourses([]);
                setPagination(null);
            } finally {
                setLoading(false);
            }
        };

        getCourses();
    }, [searchTerm, sortField, sortOrder, levelId, page, pageSize]);

    return { courses, pagination, loading, error };
};

// Custom hook for fetching levels
const useLevels = () => {
    const [levels, setLevels] = useState<Level[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getLevels = async () => {
            try {
                // Since there's no specific API for getting levels in api.ts,
                // we'll use a placeholder for now
                // In a real implementation, you would use the appropriate API call
                setLevels([
                    { id: 1, name: 'Cơ bản' },
                    { id: 2, name: 'Nâng cao' },
                    { id: 3, name: 'Chuyên sâu' }
                ]);
            } catch (err) {
                console.error('Error fetching levels:', err);
            } finally {
                setLoading(false);
            }
        };

        getLevels();
    }, []);

    return { levels, loading };
};

// Format seconds to hours and minutes
const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}h ${minutes > 0 ? minutes + 'm' : ''}`;
    } else if (minutes > 0) {
        return `${minutes}m`;
    } else {
        return '<1m';
    }
};

// Course Card Component
const CourseCard = ({ course }: { course: Course }) => {
    return (
        <motion.div
            className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full ${styles.cardHover} ${styles.courseCard}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="relative overflow-hidden">
                <img
                    src={course.course.banner}
                    alt={course.course.title}
                    className={`w-full h-48 object-cover ${styles.courseImage}`}
                />
                <div className={`absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 m-2 rounded-full text-xs font-medium ${styles.badgeGlow}`}>
                    {course.level.name}
                </div>
                {course.course.details?.isFree ? (
                    <div className="absolute bottom-0 left-0 bg-green-500 text-white px-3 py-1 m-2 rounded-full text-xs font-medium">
                        Miễn phí
                    </div>
                ) : (
                    <div className="absolute bottom-0 left-0 bg-amber-500 text-white px-3 py-1 m-2 rounded-full text-xs font-medium">
                        {course.course.details?.price?.toLocaleString('vi-VN')} ₫
                        {course.course.details?.priceOld > 0 && (
                            <span className="ml-2 line-through text-gray-200 text-xs">
                                {course.course.details?.priceOld?.toLocaleString('vi-VN')} ₫
                            </span>
                        )}
                    </div>
                )}
            </div>

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {course.course.title}
                </h3>
                {course.course.introduce && (
                    <p dangerouslySetInnerHTML={{ __html: course.course.introduce }} className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">

                    </p>
                )}

                <div className="mt-auto">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center">
                            <FiClock className="mr-1" />
                            <span>{formatDuration(course.course.totalDuration)}</span>
                        </div>
                        <div className="flex items-center">
                            <FiBook className="mr-1" />
                            <span>{course.course.lessonCount} bài học</span>
                        </div>
                        <div className="flex items-center">
                            <FiUsers className="mr-1" />
                            <span>{course.course.userCourseCounts}</span>
                        </div>
                    </div>

                    <Link href={`/courses/${course.course.id}`}>
                        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
                            Xem chi tiết
                        </button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

// Pagination Component
const Pagination = ({
    pagination,
    onPageChange
}: {
    pagination: PaginationInfo,
    onPageChange: (page: number) => void
}) => {
    const { currentPage, totalPages } = pagination;

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: number[] = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total pages is less than or equal to maxPagesToShow
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            // Calculate start and end of page numbers around current page
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if we're at the beginning or end
            if (currentPage <= 2) {
                end = Math.min(totalPages - 1, maxPagesToShow - 1);
            } else if (currentPage >= totalPages - 1) {
                start = Math.max(2, totalPages - maxPagesToShow + 2);
            }

            // Add ellipsis after first page if needed
            if (start > 2) {
                pages.push(-1); // -1 represents ellipsis
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis before last page if needed
            if (end < totalPages - 1) {
                pages.push(-2); // -2 represents ellipsis
            }

            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    return (
        <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-sm font-medium ${styles.paginationItem} ${currentPage === 1
                        ? 'text-gray-300 dark:text-gray-600'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                >
                    <FiChevronLeft className="h-5 w-5" />
                </button>

                {getPageNumbers().map((page, index) => (
                    page < 0 ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${styles.paginationItem} ${page === currentPage
                                ? `z-10 bg-indigo-600 border-indigo-600 text-white ${styles.paginationActive}`
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600 text-sm font-medium ${styles.paginationItem} ${currentPage === totalPages
                        ? 'text-gray-300 dark:text-gray-600'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                >
                    <FiChevronRight className="h-5 w-5" />
                </button>
            </nav>
        </div>
    );
};

// Main Component
export default function CoursesComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const COURSE_PAGE_SIZE = 9; // Define page size constant

    // Get query parameters
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'CreatedAt';
    const order = searchParams.get('order') || 'desc';
    const level = searchParams.get('level') ? parseInt(searchParams.get('level') as string) : null;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;

    // Local state for form inputs
    const [searchInput, setSearchInput] = useState(search);
    const [sortField, setSortField] = useState(sort);
    const [sortOrder, setSortOrder] = useState(order);
    const [selectedLevel, setSelectedLevel] = useState<number | null>(level);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Fetch courses and levels
    const { courses, pagination, loading, error } = useCourses(search, sort, order, level, page, COURSE_PAGE_SIZE);
    const { levels } = useLevels();

    // Handle search submission
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateQueryParams({ search: searchInput, page: 1 });
    };

    // Handle filter changes
    const handleFilterChange = () => {
        updateQueryParams({
            sort: sortField,
            order: sortOrder,
            level: selectedLevel,
            page: 1
        });
        setIsFilterOpen(false);
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        updateQueryParams({ page: newPage });
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Update query parameters
    const updateQueryParams = (params: {
        search?: string;
        sort?: string;
        order?: string;
        level?: number | null;
        page?: number;
    }) => {
        const newParams = new URLSearchParams(searchParams.toString());

        if (params.search !== undefined) {
            if (params.search) {
                newParams.set('search', params.search);
            } else {
                newParams.delete('search');
            }
        }

        if (params.sort !== undefined) {
            newParams.set('sort', params.sort);
        }

        if (params.order !== undefined) {
            newParams.set('order', params.order);
        }

        if (params.level !== undefined) {
            if (params.level !== null) {
                newParams.set('level', params.level.toString());
            } else {
                newParams.delete('level');
            }
        }

        if (params.page !== undefined) {
            if (params.page > 1) {
                newParams.set('page', params.page.toString());
            } else {
                newParams.delete('page');
            }
        }

        router.push(`/courses?${newParams.toString()}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto mb-12">
                <motion.div
                    className={`relative overflow-hidden rounded-3xl p-8 md:p-16 ${styles.heroBackground}`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="relative z-10 text-center">
                        <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
                            <span className="block">Khám phá các khóa học</span>
                            <span className={`block py-10 ${styles.gradientText}`}>Nâng cao kỹ năng của bạn</span>
                        </h1>
                        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-100">
                            Học hỏi từ các chuyên gia hàng đầu và xây dựng tương lai của bạn với các khóa học chất lượng cao.
                        </p>
                    </div>

                    {/* Floating elements */}
                    <div className={`absolute top-10 right-10 w-20 h-20 rounded-full bg-purple-500 opacity-20 blur-xl ${styles.floatingElement}`}></div>
                    <div className={`absolute bottom-10 left-10 w-32 h-32 rounded-full bg-indigo-500 opacity-20 blur-xl ${styles.floatingElement}`} style={{ animationDelay: '1s' }}></div>
                    <div className={`absolute top-1/2 left-1/4 w-16 h-16 rounded-full bg-pink-500 opacity-10 blur-xl ${styles.floatingElement}`} style={{ animationDelay: '2s' }}></div>
                </motion.div>

                {/* Search and Filter Section */}
                <div className="mt-10 max-w-3xl mx-auto">
                    <form onSubmit={handleSearch} className="flex w-full">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className={`block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-l-md leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white sm:text-sm ${styles.searchInput}`}
                                placeholder="Tìm kiếm khóa học..."
                            />
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Tìm kiếm
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <FiFilter className="mr-2 h-5 w-5" />
                            Bộ lọc
                        </button>
                    </form>

                    {/* Filter Panel */}
                    {isFilterOpen && (
                        <motion.div
                            className={`mt-4 p-4 bg-white dark:bg-gray-800 shadow-md rounded-md ${styles.filterPanel}`}
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Sắp xếp theo
                                    </label>
                                    <select
                                        value={sortField}
                                        onChange={(e) => setSortField(e.target.value)}
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    >
                                        <option value="CreatedAt">Ngày tạo</option>
                                        <option value="Title">Tên khóa học</option>
                                        <option value="userCourseCounts">Số người học</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Thứ tự
                                    </label>
                                    <select
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    >
                                        <option value="asc">Tăng dần</option>
                                        <option value="desc">Giảm dần</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Cấp độ
                                    </label>
                                    <select
                                        value={selectedLevel || ''}
                                        onChange={(e) => setSelectedLevel(e.target.value ? parseInt(e.target.value) : null)}
                                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Tất cả cấp độ</option>
                                        {levels.map((level) => (
                                            <option key={level.Id} value={level.Id}>
                                                {level.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleFilterChange}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Áp dụng
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Courses Grid */}
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="text-red-500 text-xl">{error}</div>
                        <button
                            onClick={() => router.refresh()}
                            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Thử lại
                        </button>
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Không tìm thấy khóa học nào</h3>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course) => {
                                console.log('course', course);
                                return (
                                    <CourseCard key={course.course.Id} course={course} />
                                )
                            })}
                        </div>

                        {pagination && pagination.totalPages > 1 && (
                            <Pagination
                                pagination={pagination}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}