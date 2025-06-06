'use client'
import { useEffect, useState, ChangeEvent, useCallback, useRef } from "react";
import { getSearchWithType } from "@/api/axios/api";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";

// Icons
import { FiSearch, FiX, FiClock, FiUser, FiBook, FiHeart, FiMessageSquare, FiCheckCircle } from "react-icons/fi";
import { HiOutlineAcademicCap, HiOutlineDocumentText, HiOutlineUserGroup } from "react-icons/hi";
import { generateSlug } from "@/Utils/functions/slugify";

// Types
interface Course {
    id: string;
    title: string;
    type: string;
    banner: string;
    description: string | null;
    createdAt: string;
    countUsers: number;
    countLesson: number;
}

interface User {
    id: string;
    fullName: string;
    userName: string;
    roleId: number;
    avatar: string;
    isFriend: boolean;
    commonFriends: number | null;
    statusFriend: string | null;
}

interface Blog {
    id: string;
    title: string;
    type: string;
    banner: string;
    createdAt: string;
    numberOfHeart: number;
    numberOfComment: number;
}

interface PageState {
    post: number;
    user: number;
    course: number;
}

interface HasMoreState {
    post: boolean;
    user: boolean;
    course: boolean;
}

interface Data {
    post: Blog[];
    user: User[];
    course: Course[];
}

type ActiveTab = 'user' | 'post' | 'course';

const isActiveTab = (value: any): value is ActiveTab => {
    return value === 'user' || value === 'post' || value === 'course';
};

// Main component
const Search = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Get query parameters
    const typeParam = searchParams.get('type');
    const keywordParam = searchParams.get('keyword');

    // State
    const [keyword, setKeyword] = useState(keywordParam || '');
    const initialTab: ActiveTab = isActiveTab(typeParam) ? typeParam : 'course';
    const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [showClearButton, setShowClearButton] = useState(!!keyword);

    const [data, setData] = useState<Data>({
        post: [],
        user: [],
        course: []
    });

    const [page, setPage] = useState<PageState>({
        post: 1,
        user: 1,
        course: 1,
    });

    const [hasMore, setHasMore] = useState<HasMoreState>({
        post: true,
        user: true,
        course: true,
    });

    // Effects
    useEffect(() => {
        const currentTab = searchParams.get('type') as ActiveTab;
        const currentKeyword = searchParams.get('keyword');

        if (keyword !== currentKeyword) {
            setKeyword(currentKeyword || '');
            setShowClearButton(!!currentKeyword);
        }

        if (currentTab) {
            setActiveTab(currentTab);
            if (currentKeyword && hasMore[currentTab]) {
                resetSearchState();
                fetchData(currentKeyword, currentTab, 1);
            }
        } else if (currentKeyword) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('type', 'course');
            router.push(`?${params.toString()}`);
            setActiveTab('course');
            resetSearchState();
            fetchData(currentKeyword, 'course', 1);
        }
    }, [searchParams]);

    // Reset search state
    const resetSearchState = () => {
        setPage({
            post: 1,
            user: 1,
            course: 1,
        });
        setHasMore({
            post: true,
            user: true,
            course: true,
        });
        setData({
            post: [],
            user: [],
            course: []
        });
    };

    // Debounce function
    function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
        let timer: NodeJS.Timeout;
        return (...args: Parameters<T>) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    }

    // Fetch data from API
    const fetchData = async (searchTerm: string, type: ActiveTab, pageNumber: number) => {
        if (!searchTerm.trim()) return;

        setIsSearching(true);
        try {
            const res = await getSearchWithType(searchTerm, type, pageNumber);
            if (res?.statusCode === 200) {
                if (pageNumber === 1) {
                    setData(prev => ({
                        ...prev,
                        [type]: res?.data || []
                    }));
                } else {
                    setData(prev => ({
                        ...prev,
                        [type]: [...prev[type], ...(res?.data || [])]
                    }));
                }

                setHasMore(prev => ({
                    ...prev,
                    [type]: (res?.data?.length || 0) >= 5
                }));
            }
        } catch (error) {
            console.error("Search error:", error);
            setHasMore(prev => ({ ...prev, [type]: false }));
        } finally {
            setIsSearching(false);
        }
    };

    // Handle search input change with debounce
    const handleSearch = useCallback(
        debounce(async (value: string) => {
            if (value.trim()) {
                await fetchData(value, activeTab, 1);
            }
        }, 300),
        [activeTab]
    );

    // Handle input change
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setKeyword(value);
        setShowClearButton(!!value);

        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set('keyword', value);
        } else {
            params.delete('keyword');
        }
        router.push(`?${params.toString()}`);

        if (value.trim()) {
            resetSearchState();
            handleSearch(value);
        }
    };

    // Clear search input
    const clearSearch = () => {
        setKeyword('');
        setShowClearButton(false);
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }

        const params = new URLSearchParams(searchParams.toString());
        params.delete('keyword');
        router.push(`?${params.toString()}`);
    };

    // Fetch more data for infinite scroll
    const fetchMoreData = async () => {
        if (hasMore[activeTab] && keyword) {
            const nextPage = page[activeTab] + 1;
            await fetchData(keyword, activeTab, nextPage);
            setPage(prev => ({ ...prev, [activeTab]: nextPage }));
        }
    };

    // Change active tab
    const changeTab = (tab: ActiveTab) => {
        setActiveTab(tab);

        const params = new URLSearchParams(searchParams.toString());
        params.set('type', tab);
        router.push(`?${params.toString()}`);

        if (keyword && hasMore[tab] && data[tab].length === 0) {
            fetchData(keyword, tab, page[tab]);
        }
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).format(date);
    };

    // Render course card
    const renderCourseCard = (course: Course) => (
        <motion.div
            key={course.id}
            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5 }}
        >
            <div className="relative overflow-hidden h-48">
                <motion.img
                    src={course.banner || "https://placehold.co/600x400/3b82f6/FFFFFF.png?text=F8+Course"}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
                    whileHover={{ scale: 1.05 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                        <Link
                            href={`/courses/${generateSlug(course.title, Number(course.id))}`}
                            className="w-full block text-center py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                        >
                            Xem khóa học
                        </Link>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <Link href={`/courses/${generateSlug(course.title, Number(course.id))}`}>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {course.title}
                    </h3>
                </Link>

                {course.description && (
                    <div
                        className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 text-sm"
                        dangerouslySetInnerHTML={{ __html: course.description }}
                    />
                )}

                <div className="flex flex-wrap justify-between text-sm text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                        <FiUser className="mr-2 text-indigo-500" />
                        <span>{course.countUsers} học viên</span>
                    </div>
                    <div className="flex items-center">
                        <FiBook className="mr-2 text-indigo-500" />
                        <span>{course.countLesson} bài học</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    // Render post card
    const renderPostCard = (post: Blog) => (
        <motion.div
            key={post.id}
            className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5 }}
        >
            <Link href={`/post/${generateSlug(post.title, Number(post.id))}`} className="block">
                <div className="relative overflow-hidden h-48">
                    <motion.img
                        src={post.banner || "https://placehold.co/600x400/3b82f6/FFFFFF.png?text=F8+Post"}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
                        whileHover={{ scale: 1.05 }}
                    />
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                        {formatDate(post.createdAt)}
                    </div>
                </div>

                <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {post.title}
                    </h3>

                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center">
                            <FiHeart className="mr-2 text-rose-500" />
                            <span>{post.numberOfHeart || 0}</span>
                        </div>
                        <div className="flex items-center">
                            <FiMessageSquare className="mr-2 text-indigo-500" />
                            <span>{post.numberOfComment || 0}</span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );

    // Render user card
    const renderUserCard = (user: User) => (
        <motion.div
            key={user.id}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5 }}
        >
            <div className="flex items-center">
                <div className="relative">
                    <motion.img
                        src={user.avatar || "https://placehold.co/200x200/3b82f6/FFFFFF.png?text=User"}
                        alt={user.fullName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100"
                        whileHover={{ scale: 1.1 }}
                    />
                    {user.roleId === 2 && (
                        <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full p-1">
                            <FiCheckCircle className="text-white text-sm" />
                        </div>
                    )}
                </div>

                <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {user.fullName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        @{user.userName}
                    </p>
                    {user.roleId === 2 && (
                        <span className="inline-block mt-1 text-xs bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 px-2 py-0.5 rounded-full">
                            Quản trị viên
                        </span>
                    )}
                </div>

                <motion.button
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${user.isFriend
                        ? "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                        : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {user.isFriend ? "Bạn bè" : "Kết bạn"}
                </motion.button>
            </div>

            {user.commonFriends && user.commonFriends > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.commonFriends} bạn chung
                    </p>
                </div>
            )}
        </motion.div>
    );

    // Render empty state
    const renderEmptyState = () => (
        <motion.div
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {!keyword ? (
                <>
                    <div className="w-40 h-40 mb-8 relative">
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            animate={{
                                scale: [1, 1.1, 1],
                            }}
                            transition={{
                                repeat: Infinity,
                                duration: 3,
                                ease: "easeInOut"
                            }}
                        >
                            <FiSearch className="text-7xl text-indigo-200 dark:text-indigo-900" />
                        </motion.div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Bạn đang tìm kiếm điều gì?
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                        Nhập từ khóa để tìm kiếm khóa học, bài viết hoặc người dùng
                    </p>
                </>
            ) : (
                <>
                    <img
                        src="https://illustrations.popsy.co/amber/no-results-found.svg"
                        alt="No results"
                        className="w-64 h-64 mb-8"
                    />
                    <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                        Không tìm thấy kết quả
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                        Không tìm thấy kết quả nào cho "{keyword}". Vui lòng thử lại với từ khóa khác.
                    </p>
                </>
            )}
        </motion.div>
    );

    // Render loading state
    const renderLoadingState = () => (
        <div className="flex justify-center items-center py-16">
            <div className="relative">
                <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-indigo-400 animate-spin"></div>
                </div>
            </div>
        </div>
    );

    // Render content based on current state
    const renderContent = () => {
        if (!keyword.trim()) {
            return renderEmptyState();
        }

        if (isSearching && data[activeTab].length === 0) {
            return renderLoadingState();
        }

        if (data[activeTab].length === 0) {
            return renderEmptyState();
        }

        return (
            <InfiniteScroll
                dataLength={data[activeTab].length}
                next={fetchMoreData}
                hasMore={hasMore[activeTab]}
                loader={
                    <div className="flex justify-center py-6">
                        <div className="h-10 w-10 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
                    </div>
                }
                endMessage={
                    <p className="text-center py-6 text-gray-400 dark:text-gray-500">
                        Đã hiển thị tất cả kết quả
                    </p>
                }
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`grid gap-6 ${activeTab === 'user'
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            }`}
                    >
                        {activeTab === 'course' && data.course.map(renderCourseCard)}
                        {activeTab === 'post' && data.post.map(renderPostCard)}
                        {activeTab === 'user' && data.user.map(renderUserCard)}
                    </motion.div>
                </AnimatePresence>
            </InfiniteScroll>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-8 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Tìm kiếm
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Khám phá khóa học, bài viết và kết nối với người dùng khác trong cộng đồng F8
                    </p>
                </motion.div>

                {/* Search input */}
                <motion.div
                    className="max-w-3xl mx-auto mb-10"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className={`relative rounded-full shadow-md ${isSearchFocused
                        ? 'ring-2 ring-indigo-500 shadow-indigo-100 dark:shadow-none'
                        : ''
                        }`}>
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <FiSearch className="h-6 w-6 text-gray-400" />
                        </div>
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={keyword}
                            onChange={handleInputChange}
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => setIsSearchFocused(false)}
                            placeholder="Tìm kiếm khóa học, bài viết, người dùng..."
                            className="block w-full pl-14 pr-14 py-5 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none text-lg transition-all duration-300 border-none"
                        />
                        {showClearButton && (
                            <button
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 pr-5 flex items-center"
                            >
                                <FiX className="h-6 w-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                            </button>
                        )}
                    </div>
                </motion.div>

                {/* Tabs */}
                {keyword && (
                    <motion.div
                        className="max-w-6xl mx-auto mb-8"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex justify-center space-x-2 md:space-x-4">
                            <motion.button
                                onClick={() => changeTab('course')}
                                className={`flex items-center px-6 py-3 rounded-full font-medium text-base transition-all duration-300 ${activeTab === 'course'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <HiOutlineAcademicCap className={`mr-2 text-xl ${activeTab === 'course' ? 'text-white' : 'text-indigo-500'
                                    }`} />
                                Khóa học
                            </motion.button>

                            <motion.button
                                onClick={() => changeTab('post')}
                                className={`flex items-center px-6 py-3 rounded-full font-medium text-base transition-all duration-300 ${activeTab === 'post'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <HiOutlineDocumentText className={`mr-2 text-xl ${activeTab === 'post' ? 'text-white' : 'text-indigo-500'
                                    }`} />
                                Bài viết
                            </motion.button>

                            <motion.button
                                onClick={() => changeTab('user')}
                                className={`flex items-center px-6 py-3 rounded-full font-medium text-base transition-all duration-300 ${activeTab === 'user'
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20'
                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                <HiOutlineUserGroup className={`mr-2 text-xl ${activeTab === 'user' ? 'text-white' : 'text-indigo-500'
                                    }`} />
                                Người dùng
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Search results */}
                <div className="max-w-6xl mx-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Search;