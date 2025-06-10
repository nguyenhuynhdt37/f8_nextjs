'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useAppSelector } from '@/redux/hook/hook';
import { useRouter } from 'next/navigation';
import LoadingBar from 'react-top-loading-bar';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { timeAgo } from '@/Utils/functions';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { getMyCoursesAsync } from '@/api/axios/api';

// Icons
import {
  FaGithub,
  FaFacebook,
  FaYoutube,
  FaCertificate,
  FaCalendarAlt,
  FaGraduationCap,
  FaUserEdit,
  FaCode,
  FaLaptopCode,
  FaRegLightbulb,
  FaTrophy,
  FaChartLine
} from 'react-icons/fa';
import { FaCircleCheck, FaShareNodes } from 'react-icons/fa6';
import { FiExternalLink, FiEdit, FiGrid, FiList, FiBookmark } from 'react-icons/fi';
import { IoRocketOutline, IoBriefcaseOutline, IoSchoolOutline } from 'react-icons/io5';
import { BiLinkExternal } from 'react-icons/bi';
import { TbProgressCheck } from 'react-icons/tb';

const Profile = ({ user }: any) => {
  const userRedux = useAppSelector(state => state?.auth?.user);
  const loadingRef = useRef<any>(null);
  const [data, setData] = useState<any>(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [activeTab, setActiveTab] = useState('courses');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('EnrolledAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  console.log(courses);

  useEffect(() => {
    if (!user) {
      setData(userRedux);
      setIsCurrentUser(true);
    } else {
      setData(user);
      setIsCurrentUser(userRedux?.user?.id === user?.user?.id);
    }
  }, [user, userRedux]);

  useEffect(() => {
    if (isCurrentUser) {
      fetchMyCourses();
    }
  }, [isCurrentUser, pageNumber, pageSize, sortField, sortOrder]);

  const fetchMyCourses = async () => {
    if (!isCurrentUser) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await getMyCoursesAsync(pageNumber, pageSize, sortField, sortOrder);
      setCourses(response.data.courses);
      setTotalPages(response.data.pagination.totalPages);
      setPageNumber(response.data.pagination.currentPage);
      setPageSize(response.data.pagination.pageSize);
    } catch (err: any) {
      console.error('Error fetching my courses:', err);
      setError(err.message || 'Không thể tải danh sách khóa học');
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (page === pageNumber) return;
    setPageNumber(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleCourseClick = (id: number) => {
    loadingRef.current?.continuousStart();
    router.push(`/learning/${id}`);
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const { user: profileUser } = data;

  const ProgressCircle = ({ percentage }: { percentage: number }) => {
    const circumference = 2 * Math.PI * 40;
    return (
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 rotate-[-90deg]" viewBox="0 0 100 100">
          <circle
            className={`stroke-gray-200 dark:stroke-gray-700 fill-none`}
            cx="50" cy="50" r="40" strokeWidth="10"
          />
          <motion.circle
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: circumference - (percentage / 100) * circumference
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={`stroke-indigo-600 dark:stroke-indigo-400 fill-none`}
            cx="50" cy="50" r="40"
            strokeWidth="10"
            strokeDasharray={circumference}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{percentage}%</span>
        </div>
      </div>
    );
  };

  const AchievementCard = ({ icon, title, value, color }: any) => {
    return (
      <motion.div
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        className={`p-5 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700`}
      >
        <div className={`flex items-center`}>
          <div className={`p-3 rounded-full mr-4 ${color}`}>
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <LoadingBar color="#4f46e5" ref={loadingRef} height={3} shadow={true} />

      {/* Hero Section - Redesigned with Glass Effect */}
      <div className="relative">
        <div className="h-72 md:h-80 w-full bg-gradient-to-r from-indigo-600/90 to-violet-600/90 relative overflow-hidden">
          {/* Animated Gradient Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'linear-gradient(125deg, rgba(79, 70, 229, 0.7) 0%, rgba(147, 51, 234, 0.7) 100%)',
              backgroundSize: '200% 200%',
              animation: 'gradientAnimation 15s ease infinite'
            }}
          >
            <style jsx global>{`
              @keyframes gradientAnimation {
                0% { background-position: 0% 50% }
                50% { background-position: 100% 50% }
                100% { background-position: 0% 50% }
              }
              
              @keyframes float {
                0% { transform: translateY(0px) }
                50% { transform: translateY(-20px) }
                100% { transform: translateY(0px) }
              }
              
              .float-element {
                animation: float 6s ease-in-out infinite;
              }
              
              .float-element-2 {
                animation: float 8s ease-in-out infinite;
              }
              
              .float-element-3 {
                animation: float 10s ease-in-out infinite;
              }
            `}</style>
          </motion.div>

          {/* Abstract Shape Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 text-white/10 float-element">
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="8" />
              </svg>
            </div>
            <div className="absolute bottom-10 right-20 text-white/10 float-element-2">
              <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="30" y="30" width="80" height="80" stroke="currentColor" strokeWidth="8" />
              </svg>
            </div>
            <div className="absolute top-40 right-40 text-white/10 float-element-3">
              <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 50L50 10L90 50L50 90L10 50Z" stroke="currentColor" strokeWidth="8" />
              </svg>
            </div>
          </div>

          {/* Profile Info */}
          <div className="absolute bottom-0 left-0 w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="flex flex-col md:flex-row items-end md:items-center pb-4">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative -mb-20 md:-mb-12 z-10 flex-shrink-0"
                >
                  <div className="rounded-xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl relative">
                    <img
                      className="w-32 h-32 md:w-40 md:h-40 object-cover"
                      src={profileUser?.avatar || "https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg"}
                      alt={profileUser?.fullName || "User"}
                    />
                    {/* Status Badge */}
                    {profileUser?.isActive && (
                      <div className="absolute bottom-2 right-2 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    )}
                  </div>
                  {profileUser?.roleId === 2 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 rounded-full p-1.5 shadow-lg"
                    >
                      <FaCircleCheck className="text-indigo-600 dark:text-indigo-400 text-2xl" />
                    </motion.div>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="md:ml-6 mt-4 md:mt-0 md:pb-4 z-10"
                >
                  <div className="flex items-center flex-wrap gap-2">
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {profileUser?.fullName || "User"}
                    </h1>
                    {profileUser?.roleId === 2 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-indigo-100 dark:text-indigo-200 text-sm md:text-base">
                    @{profileUser?.username || profileUser?.email?.split('@')[0] || "username"}
                  </p>
                </motion.div>

                {isCurrentUser && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="ml-auto mt-4 md:mt-0 z-10"
                  >
                    <button
                      onClick={() => router.push('/profile/edit')}
                      className="inline-flex items-center px-4 py-2 rounded-lg shadow-md text-sm font-medium text-white bg-white/20 backdrop-blur-sm hover:bg-white/30 focus:outline-none transition-all duration-200"
                    >
                      <FiEdit className="mr-2" />
                      Chỉnh sửa hồ sơ
                    </button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Glass Card Background for Stats */}
          {/* <div className="absolute -bottom-24 left-0 w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className={`w-full rounded-xl overflow-hidden backdrop-blur-md ${isDarkMode ? 'bg-gray-900/60 shadow-lg shadow-indigo-500/10' : 'bg-white/80 shadow-xl shadow-indigo-500/10'}`}
                style={{ height: '120px' }}
              ></motion.div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 -mt-16 mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-lg flex items-center`}
          >
            <div className={`flex items-center justify-center p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <IoSchoolOutline className={`text-3xl ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <div className="ml-5">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Khóa học</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{courses?.length || 0}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-lg flex items-center`}
          >
            <div className={`flex items-center justify-center p-4 rounded-lg ${isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100'}`}>
              <TbProgressCheck className={`text-3xl ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            </div>
            <div className="ml-5">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Đã hoàn thành</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {courses?.filter((c: any) => c.enrollment?.completionStatus === 100)?.length || 0}/{courses?.length || 0}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`p-6 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-lg flex items-center`}
          >
            <div className={`flex items-center justify-center p-4 rounded-lg ${isDarkMode ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
              <FaChartLine className={`text-3xl ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
            <div className="ml-5">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Kinh nghiệm</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{profileUser?.experience || "Beginner"}</p>
            </div>
          </motion.div>
        </div>

        {/* Bio Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`p-6 rounded-xl mb-8 ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-100'} shadow-lg`}
        >
          <div className="flex items-center mb-4">
            <div className={`p-2 rounded-md ${isDarkMode ? 'bg-indigo-900/30' : 'bg-indigo-100'} mr-3`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Giới thiệu</h2>
          </div>

          {profileUser?.bio ? (
            <div className={`prose max-w-none ${isDarkMode ? 'prose-invert' : ''} prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400 prose-a:text-blue-600 dark:prose-a:text-blue-400`} dangerouslySetInnerHTML={{ __html: profileUser.bio }} />
          ) : (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-16 w-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                {isCurrentUser ? "Bạn chưa thêm thông tin giới thiệu." : "Người dùng chưa thêm thông tin giới thiệu."}
              </p>
              {isCurrentUser && (
                <button
                  onClick={() => router.push('/profile/edit')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors"
                >
                  Thêm giới thiệu
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* Tabs Navigation - Redesigned with Underline Style */}
        <div className="mb-8">
          <div className={`flex overflow-x-auto scrollbar-none gap-8 pb-2 ${isDarkMode ? 'border-b border-gray-800' : 'border-b border-gray-200'}`}>
            {['courses', 'about', 'social'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-1 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center ${activeTab === tab
                  ? isDarkMode ? 'text-indigo-400' : 'text-indigo-600'
                  : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab === 'courses' && <FaGraduationCap className="mr-2" />}
                {tab === 'about' && <FaUserEdit className="mr-2" />}
                {tab === 'social' && <FaShareNodes className="mr-2" />}
                {tab === 'courses' && 'Khóa học của tôi'}
                {tab === 'about' && 'Thông tin cá nhân'}
                {tab === 'social' && 'Liên kết xã hội'}

                {/* Active Tab Indicator */}
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${isDarkMode ? 'bg-indigo-400' : 'bg-indigo-600'}`}
                    initial={false}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'courses' && (
            <motion.div
              key="courses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Courses Header with Actions */}
              <div className={`flex justify-between items-center p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Khóa học đã tham gia
                </h2>
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-md border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex rounded-md overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-1.5 ${viewMode === 'grid'
                          ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                          : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        <FiGrid className="text-lg" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-1.5 ${viewMode === 'list'
                          ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-800'
                          : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        <FiList className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                  <div className="text-red-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Đã xảy ra lỗi</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
                  <button
                    onClick={fetchMyCourses}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                  >
                    Thử lại
                  </button>
                </div>
              ) : courses && courses.length > 0 ? (
                <>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.map((courseData: any, index: number) => {
                        const course = courseData.course;
                        const enrollment = courseData.enrollment;
                        const completionPercent = enrollment?.completionStatus || 0;

                        return (
                          <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                            className={`group rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 ${isDarkMode
                              ? 'bg-gray-800 border border-gray-700 shadow-lg hover:shadow-indigo-500/20'
                              : 'bg-white border border-gray-200 shadow-md hover:shadow-indigo-500/30'
                              }`}
                            onClick={() => handleCourseClick(course.id)}
                          >
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={course.banner || '/images/course-default.png'}
                                alt={course.title}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>

                              {/* Progress Indicator */}
                              <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 rounded-full p-1 shadow-lg">
                                <div className="w-8 h-8 relative">
                                  <svg className="w-8 h-8 rotate-[-90deg]" viewBox="0 0 24 24">
                                    <circle className="stroke-gray-200 dark:stroke-gray-700 fill-none" cx="12" cy="12" r="10" strokeWidth="2" />
                                    <motion.circle
                                      initial={{ strokeDashoffset: 62.83 }}
                                      animate={{ strokeDashoffset: 62.83 - (completionPercent / 100) * 62.83 }}
                                      transition={{ duration: 1, ease: "easeOut" }}
                                      className={`stroke-indigo-600 dark:stroke-indigo-400 fill-none`}
                                      cx="12" cy="12" r="10"
                                      strokeWidth="2"
                                      strokeDasharray="62.83"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{completionPercent}%</span>
                                  </div>
                                </div>
                              </div>

                              <div className="absolute bottom-3 left-3">
                                <span className="text-xs text-white bg-indigo-600/80 px-2 py-1 rounded-md">
                                  {course.lessons || 0} bài học
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              <h3 className={`font-bold text-lg mb-2 line-clamp-2 group-hover:text-indigo-500 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'
                                }`}>
                                {course.title}
                              </h3>

                              <div className="mt-4 flex justify-between items-center">
                                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  Đăng ký: {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}
                                </span>

                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="flex items-center text-xs bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-md"
                                >
                                  Tiếp tục học
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {courses.map((courseData: any, index: number) => {
                        const course = courseData.course;
                        const enrollment = courseData.enrollment;
                        const completionPercent = enrollment?.completionStatus || 0;

                        return (
                          <motion.div
                            key={course.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            onClick={() => handleCourseClick(course.id)}
                            className={`group flex flex-col sm:flex-row rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isDarkMode
                              ? 'bg-gray-800 border border-gray-700 shadow-lg'
                              : 'bg-white border border-gray-200 shadow-md'
                              }`}
                          >
                            <div className="relative h-48 sm:h-auto sm:w-60 flex-shrink-0">
                              <img
                                src={course.banner || '/images/course-default.png'}
                                alt={course.title}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>

                              <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-800/90 rounded-full px-2 py-1 text-xs font-medium backdrop-blur-sm">
                                {course.lessons || 0} bài học
                              </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between">
                              <div>
                                <h3 className={`font-bold text-lg mb-2 group-hover:text-indigo-500 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'
                                  }`}>
                                  {course.title}
                                </h3>

                                <div className="flex items-center text-xs mb-4">
                                  <FaCalendarAlt className={`mr-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                                    Đăng ký: {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Tiến độ học tập
                                  </span>
                                  <span className={`text-sm font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                    {completionPercent}%
                                  </span>
                                </div>
                                <div className={`w-full h-2 rounded-full ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPercent}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className={`h-2 rounded-full bg-indigo-600 dark:bg-indigo-500`}
                                  ></motion.div>
                                </div>

                                <motion.button
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center space-x-2 transition-colors"
                                >
                                  <span>Tiếp tục học</span>
                                </motion.button>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-8">
                      <div className="flex items-center justify-between">
                        <div className="hidden sm:flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>Hiển thị trang {pageNumber} trên {totalPages} trang</span>
                        </div>

                        <div className="flex-1 flex justify-center sm:justify-end">
                          <nav className="relative z-0 inline-flex shadow-sm -space-x-px rounded-md" aria-label="Phân trang">
                            {/* Nút Trang trước */}
                            <button
                              onClick={() => pageNumber > 1 && handlePageChange(pageNumber - 1)}
                              disabled={pageNumber <= 1}
                              className={`relative inline-flex items-center px-3 py-2 rounded-l-md border ${pageNumber <= 1
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                } text-sm font-medium border-gray-300 dark:border-gray-700`}
                            >
                              <span className="sr-only">Trang trước</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>

                            {/* Các nút số trang */}
                            {(() => {
                              // Tạo mảng các trang cần hiển thị
                              const pages = [];
                              const maxVisiblePages = 5; // Số lượng nút trang tối đa hiển thị

                              // Xác định range các trang sẽ hiển thị
                              let startPage = Math.max(1, pageNumber - Math.floor(maxVisiblePages / 2));
                              let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                              // Điều chỉnh startPage nếu endPage đã ở gần cuối
                              if (endPage - startPage + 1 < maxVisiblePages) {
                                startPage = Math.max(1, endPage - maxVisiblePages + 1);
                              }

                              // Luôn hiển thị trang đầu tiên
                              if (startPage > 1) {
                                pages.push(
                                  <button
                                    key={1}
                                    onClick={() => handlePageChange(1)}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700`}
                                  >
                                    1
                                  </button>
                                );

                                // Thêm dấu ... nếu cần
                                if (startPage > 2) {
                                  pages.push(
                                    <span key="ellipsis-start" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                                      ...
                                    </span>
                                  );
                                }
                              }

                              // Thêm các trang trong khoảng
                              for (let i = startPage; i <= endPage; i++) {
                                if (i === 1 || i === totalPages) continue; // Đã xử lý riêng

                                pages.push(
                                  <button
                                    key={i}
                                    onClick={() => handlePageChange(i)}
                                    className={`relative inline-flex items-center px-4 py-2 border ${i === pageNumber
                                      ? 'z-10 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 dark:border-indigo-500 text-indigo-600 dark:text-indigo-300'
                                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                      } text-sm font-medium`}
                                    aria-current={i === pageNumber ? 'page' : undefined}
                                  >
                                    {i}
                                  </button>
                                );
                              }

                              // Luôn hiển thị trang cuối cùng
                              if (endPage < totalPages) {
                                // Thêm dấu ... nếu cần
                                if (endPage < totalPages - 1) {
                                  pages.push(
                                    <span key="ellipsis-end" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                                      ...
                                    </span>
                                  );
                                }

                                pages.push(
                                  <button
                                    key={totalPages}
                                    onClick={() => handlePageChange(totalPages)}
                                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700`}
                                  >
                                    {totalPages}
                                  </button>
                                );
                              }

                              return pages;
                            })()}

                            {/* Nút Trang tiếp theo */}
                            <button
                              onClick={() => pageNumber < totalPages && handlePageChange(pageNumber + 1)}
                              disabled={pageNumber >= totalPages}
                              className={`relative inline-flex items-center px-3 py-2 rounded-r-md border ${pageNumber >= totalPages
                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                } text-sm font-medium border-gray-300 dark:border-gray-700`}
                            >
                              <span className="sr-only">Trang tiếp</span>
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </nav>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full py-16 text-center bg-white dark:bg-gray-800 rounded-xl shadow-sm"
                >
                  <div className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <IoRocketOutline className="w-20 h-20 mx-auto mb-4" />
                  </div>
                  <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Hành trình học tập chưa bắt đầu
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
              )}
            </motion.div>
          )}

          {activeTab === 'about' && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Giới thiệu bản thân
                </h2>

                {profileUser?.bio ? (
                  <div
                    className="prose dark:prose-invert max-w-none prose-headings:text-indigo-600 dark:prose-headings:text-indigo-400 prose-a:text-blue-600 dark:prose-a:text-blue-400"
                    dangerouslySetInnerHTML={{ __html: profileUser.bio }}
                  />
                ) : (
                  <div className="text-center py-10">
                    <FaUserEdit className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {isCurrentUser
                        ? "Bạn chưa cập nhật thông tin giới thiệu bản thân."
                        : "Người dùng chưa cập nhật thông tin giới thiệu."}
                    </p>
                    {isCurrentUser && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => router.push('/profile/edit')}
                        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                      >
                        Cập nhật thông tin
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div
              key="social"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Liên kết xã hội
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profileUser?.githubLink && (
                    <motion.a
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      href={profileUser.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700">
                        <FaGithub className="text-2xl text-gray-700 dark:text-gray-300" />
                      </div>
                      <div className="ml-4 flex-1 truncate">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">GitHub</p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 truncate">{profileUser.githubLink.replace('https://', '')}</p>
                      </div>
                      <BiLinkExternal className="text-gray-400" />
                    </motion.a>
                  )}

                  {profileUser?.facebookLink && (
                    <motion.a
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      href={profileUser.facebookLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <FaFacebook className="text-2xl text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-4 flex-1 truncate">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Facebook</p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 truncate">{profileUser.facebookLink.replace('https://', '')}</p>
                      </div>
                      <BiLinkExternal className="text-gray-400" />
                    </motion.a>
                  )}

                  {profileUser?.youtubeLink && (
                    <motion.a
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      href={profileUser.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30">
                        <FaYoutube className="text-2xl text-red-600 dark:text-red-400" />
                      </div>
                      <div className="ml-4 flex-1 truncate">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">YouTube</p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 truncate">{profileUser.youtubeLink.replace('https://', '')}</p>
                      </div>
                      <BiLinkExternal className="text-gray-400" />
                    </motion.a>
                  )}

                  {profileUser?.personalWebsite && (
                    <motion.a
                      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                      href={profileUser.personalWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <FiExternalLink className="text-2xl text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="ml-4 flex-1 truncate">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Website</p>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 truncate">{profileUser.personalWebsite.replace('https://', '')}</p>
                      </div>
                      <BiLinkExternal className="text-gray-400" />
                    </motion.a>
                  )}

                  {!profileUser?.githubLink && !profileUser?.facebookLink && !profileUser?.youtubeLink && !profileUser?.personalWebsite && (
                    <div className="col-span-1 md:col-span-2 text-center py-10">
                      <FaShareNodes className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
                      <p className="text-gray-500 dark:text-gray-400">
                        {isCurrentUser
                          ? "Bạn chưa thêm liên kết xã hội nào."
                          : "Người dùng chưa thêm liên kết xã hội nào."}
                      </p>
                      {isCurrentUser && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => router.push('/profile/edit')}
                          className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
                        >
                          Thêm liên kết
                        </motion.button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Profile;
