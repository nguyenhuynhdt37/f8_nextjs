'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hook/hook';
import { setStateNav } from '@/redux/reducers/slices/NavbarSlice';
import React, { useEffect, useState, useRef } from 'react';

import Link from 'next/link';
import { getStudySchedule } from '@/api/axios/api';
import Login from '../Login';
import { motion, AnimatePresence } from '@/lib/motion';
import { FiArrowRight, FiClock, FiBook, FiUsers, FiCheckCircle, FiAward, FiCoffee, FiLayers, FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '@/context/ThemeContext';

const LearningPaths = () => {
  const [openLogin, setOpenLogin] = useState(false);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useAppSelector(state => state.auth?.user);
  const [studySechedule, setStudySechedule] = useState<any>([]);
  const [popularCourses, setPopularCourses] = useState<any>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [animateParticles, setAnimateParticles] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  console.log(studySechedule);

  useEffect(() => {
    dispatch(setStateNav(2));
    const handleGetStudys = async () => {
      setIsLoading(true);
      try {
        // Sử dụng API mới để lấy thông tin chi tiết hơn
        const res = await getStudySchedule();
        if (res?.statusCode === 200) {
          setStudySechedule(res?.data);

          // Kích hoạt hiệu ứng particles khi tải xong dữ liệu
          setTimeout(() => {
            setAnimateParticles(true);
            setTimeout(() => setAnimateParticles(false), 2000);
          }, 800);

          // Nếu có ít nhất một lộ trình, lấy các khóa học phổ biến
        }
      } catch (error) {
        console.error("Error fetching learning paths:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (studySechedule?.length <= 0) {
      handleGetStudys();
    }
  }, [user]);

  // Hiệu ứng particles
  const Particles = () => {
    return (
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${i % 3 === 0 ? 'from-indigo-500 to-purple-500' :
              i % 3 === 1 ? 'from-blue-500 to-cyan-500' : 'from-pink-500 to-rose-500'
              }`}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
              scale: 0
            }}
            animate={animateParticles ? {
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: [0, 1, 0],
              scale: [0, Math.random() * 2 + 0.5, 0],
            } : {}}
            transition={{
              duration: Math.random() * 2 + 1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800 dark:text-white">
      <Particles />

      {/* Theme Toggle Button */}
      <div className="fixed top-24 right-6 z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{
            scale: 1.1,
            boxShadow: theme === 'light'
              ? '0 0 8px rgba(79, 70, 229, 0.6)'
              : '0 0 8px rgba(129, 140, 248, 0.6)'
          }}
          onClick={toggleTheme}
          className="relative p-3 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 text-indigo-600 dark:text-indigo-300 hover:from-indigo-100 hover:to-purple-100 dark:hover:from-indigo-800 dark:hover:to-purple-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 overflow-hidden shadow-lg"
          aria-label={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
        >
          <div className="absolute inset-0 overflow-hidden opacity-30">
            <div className={`absolute ${theme === 'light' ? 'top-0 left-0' : 'bottom-0 right-0'} w-8 h-8 rounded-full bg-indigo-400 dark:bg-indigo-600 blur-md`}></div>
          </div>

          <AnimatePresence mode="wait">
            {theme === 'light' ? (
              <motion.div
                key="moon"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiMoon className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="sun"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FiSun className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Hero Section */}
      <div className="overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-white opacity-70 dark:from-gray-900 dark:to-gray-800 dark:opacity-90"></div>
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl dark:from-indigo-500/10 dark:to-purple-500/10"></div>
          <div className="absolute top-60 -left-20 w-60 h-60 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl dark:from-blue-500/10 dark:to-cyan-500/10"></div>
          <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-gradient-to-br from-pink-300/20 to-purple-300/20 rounded-full blur-3xl dark:from-pink-500/10 dark:to-purple-500/10"></div>
        </div>

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium"
            >
              Khám phá lộ trình học tại F8
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            >
              Lộ trình học <br />
              <span className="relative">
                hiệu quả
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 9C118.5 -1.5 202 -1.5 297 9" stroke="url(#paint0_linear)" strokeWidth="5" strokeLinecap="round" />
                  <defs>
                    <linearGradient id="paint0_linear" x1="3" y1="9" x2="297" y2="9" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#8B5CF6" />
                      <stop offset="1" stopColor="#D946EF" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-10 max-w-3xl"
            >
              Chọn lộ trình học phù hợp với mục tiêu của bạn. Mỗi lộ trình được thiết kế để giúp bạn thành thạo các kỹ năng cần thiết và đạt được mục tiêu nghề nghiệp.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3">
                  <FiClock size={18} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Học theo tốc độ của bạn</span>
              </div>

              <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3">
                  <FiAward size={18} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Chứng chỉ hoàn thành</span>
              </div>

              <div className="flex items-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-4 py-3 rounded-xl shadow-sm border border-indigo-100 dark:border-indigo-800">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mr-3">
                  <FiUsers size={18} />
                </div>
                <span className="text-gray-700 dark:text-gray-300">Cộng đồng hỗ trợ</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Login Section */}
      {!user && !isLoading ? (
        <div className="container mx-auto px-4 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-3xl"></div>
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl dark:from-indigo-500/20 dark:to-purple-500/20"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl dark:from-blue-500/20 dark:to-cyan-500/20"></div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-10 md:p-16 shadow-xl border border-indigo-100/50 dark:border-indigo-700/30 flex flex-col items-center justify-center text-center relative z-10">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-indigo-500/30"
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
              >
                Bạn chưa đăng nhập
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-gray-600 dark:text-gray-300 mb-8 text-xl max-w-lg"
              >
                Đăng nhập để xem lộ trình học và theo dõi tiến độ của bạn trên hành trình học tập tại F8.
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setOpenLogin(true)}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-indigo-500/30 flex items-center"
              >
                Đăng nhập ngay
                <FiArrowRight className="ml-2" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      ) : null}

      {/* Learning Paths Grid */}
      {!user ? null : (
        <div className="container mx-auto px-4 pb-20">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative w-20 h-20 mb-6">
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-indigo-500/20"
                  animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-500"
                  animate={{ rotate: 360, scale: [1, 0.9, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20"
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <motion.p
                className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                Đang tải lộ trình học...
              </motion.p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" ref={containerRef}>
              {studySechedule?.map((item: any, index: number) => (
                <motion.div
                  key={item.learningPath?.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  onHoverStart={() => setActiveIndex(index)}
                  onHoverEnd={() => setActiveIndex(-1)}
                  className="relative bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/10 transition-all duration-500 border border-indigo-100/50 dark:border-indigo-700/30 group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 to-purple-600/5 dark:from-indigo-600/10 dark:to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Image container with overlay */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={item?.learningPath?.image || ''}
                      alt={item?.learningPath?.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

                    {/* Content overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <h3 className="text-2xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">{item?.learningPath?.title}</h3>
                      <div className="flex flex-wrap gap-3 text-white text-sm">
                        <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <FiClock className="mr-1.5 text-indigo-300" />
                          {item?.courseTime} phút
                        </div>
                        <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <FiBook className="mr-1.5 text-indigo-300" />
                          {item?.courseItems} khóa học
                        </div>
                        <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <FiUsers className="mr-1.5 text-indigo-300" />
                          {item?.courseUserRegiterCount || 0} học viên
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-lg font-medium text-gray-700 dark:text-gray-300">Tiến độ học tập</span>
                        <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{Math.round((item?.registeredCourses / item?.courseItems) * 100) || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.round((item?.registeredCourses / item?.courseItems) * 100) || 0}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full"
                        ></motion.div>
                      </div>
                    </div>

                    <Link
                      href={`/learning-paths/${item?.learningPath?.id}`}
                      className="relative inline-flex items-center justify-center w-full px-6 py-3.5 text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl transition-all duration-300 shadow-md shadow-indigo-500/20 overflow-hidden group/button"
                    >
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-purple-600 group-hover/button:opacity-90 transition-opacity"></span>
                      <span className="absolute inset-0 w-0 bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-500 ease-out group-hover/button:w-full"></span>
                      <span className="relative flex items-center">
                        {item?.registeredCourses === 0 ? 'Bắt đầu học' : 'Xem chi tiết'}
                        <motion.div
                          animate={activeIndex === index ? { x: [0, 5, 0] } : {}}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="ml-2"
                        >
                          <FiArrowRight />
                        </motion.div>
                      </span>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Community Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative mt-32 mb-20 flex flex-col md:flex-row gap-10 items-center"
          >
            <div className="md:w-1/2 relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mb-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium inline-block"
              >
                Cộng đồng F8
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"
              >
                Tham gia cộng đồng học viên F8 trên Facebook
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8"
              >
                Hàng nghìn người khác đang học lộ trình giống như bạn. Hãy tham gia hỏi đáp, chia sẻ và hỗ trợ nhau trong quá trình học nhé.
              </motion.p>

              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                target='_blank'
                href="https://www.facebook.com/groups/f8official"
                className="inline-flex items-center px-6 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Tham gia nhóm
                <FiArrowRight className="ml-2" />
              </motion.a>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="md:w-1/2 relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
              <motion.img
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full rounded-2xl shadow-2xl relative z-10"
                src="https://fullstack.edu.vn/assets/fb-group-cards-CAn_kGMe.png"
                alt="Cộng đồng F8 trên Facebook"
              />

              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-blue-500 rounded-full opacity-20 blur-lg"></div>
              <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-indigo-500 rounded-full opacity-20 blur-lg"></div>
            </motion.div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          >
            {[
              {
                icon: <FiLayers />,
                title: "Lộ trình rõ ràng",
                description: "Học theo lộ trình được thiết kế bởi các chuyên gia hàng đầu",
                color: "from-indigo-500 to-purple-500"
              },
              {
                icon: <FiCheckCircle />,
                title: "Nội dung chất lượng",
                description: "Bài học ngắn gọn, dễ hiểu và cập nhật liên tục",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <FiCoffee />,
                title: "Học mọi lúc mọi nơi",
                description: "Học tập linh hoạt theo tốc độ và thời gian của bạn",
                color: "from-green-500 to-teal-500"
              },
              {
                icon: <FiAward />,
                title: "Chứng chỉ giá trị",
                description: "Nhận chứng chỉ sau khi hoàn thành khóa học",
                color: "from-orange-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      <Login open={openLogin} setOpen={setOpenLogin} />
    </div>
  );
};

export default LearningPaths;
