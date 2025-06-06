'use client';
import { getProcess } from '@/api/axios/api';
import Progressbar from '@/components/client/Learning/header/Progressbar';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa';
import { FiHome, FiBookOpen, FiAward, FiSettings, FiBell, FiCode, FiCoffee, FiZap } from 'react-icons/fi';
import LoadingBar from 'react-top-loading-bar';
import { motion, AnimatePresence } from '@/lib/motion';
import Link from 'next/link';
import ThemeToggle from '@/components/ui/ThemeToggle';

const Header = ({ data, courseId }: { data: any; courseId: number }) => {
  const router = useRouter();
  const [connection, setConnection] = useState<any>(null);
  const [progress, setProgress] = useState<any>({});
  const ref = useRef<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleGoBack = () => {
    ref.current.continuousStart();
    router.back();
  };

  const handleBackHome = () => {
    ref.current.continuousStart();
    router.push('/');
  };

  useEffect(() => {
    const handleRequest = async () => {
      const res = await getProcess(courseId);
      if (res?.statusCode === 200 || res?.statusCode === 201)
        setProgress(res?.data);
    };
    handleRequest();
  }, []);

  useEffect(() => {
    const connect = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl(`${process.env.NEXT_PUBLIC_API_BASE_URL}/processHub`)
        .withAutomaticReconnect()
        .build();

      connection.on('ReceiveProcess', dataCommentNew => {
        setProgress(dataCommentNew);
      });
      connection.on('Error', error => {
        console.log(error);
      });

      try {
        await connection.start();
        setConnection(connection);
      } catch (err: any) {
        console.error('Connection failed: ', err.toString());
      }
    };
    connect();
    return () => {
      connection?.stop();
    };
  }, []);

  // Track mouse position for 3D effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = () => {
      setShowDropdown(false);
      setShowNotifications(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Fake notifications
  const notifications = [
    { id: 1, title: "Bài học mới đã được thêm vào", time: "5 phút trước", isNew: true },
    { id: 2, title: "Bạn đã hoàn thành 50% khóa học", time: "2 giờ trước", isNew: true },
    { id: 3, title: "Hãy hoàn thành bài tập hôm nay", time: "1 ngày trước", isNew: false },
  ];

  return (
    <header className="relative">
      <LoadingBar color="#6366f1" height={3} ref={ref} shadow={true} />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-indigo-500/30 to-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -top-5 right-1/4 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-cyan-300/10 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-pink-500/20 to-purple-500/10 rounded-full blur-xl"></div>
      </div>

      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 right-0 h-16 backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border-b border-gray-200/80 dark:border-gray-700/80 shadow-lg z-50"
        style={{
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="flex h-full items-center justify-between px-4 md:px-6 relative">
          {/* Left section: Back button and logo */}
          <div className="flex items-center">
            <motion.button
              whileHover={{ scale: 1.15, x: -5 }}
              whileTap={{ scale: 0.9, rotate: -10 }}
              onClick={handleGoBack}
              className="dark:bg-[#111827] p-2 mr-3 rounded-full bg-white  text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-md hover:shadow-lg transition-all duration-300"
              aria-label="Quay lại"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(240,240,255,0.9) 100%)',
              }}
            >
              <FaChevronLeft className="text-xl" />
            </motion.button>

            <motion.div
              onClick={handleBackHome}
              className="flex items-center cursor-pointer"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              style={{
                transform: isHovering ?
                  `perspective(1000px) rotateY(${(mousePosition.x / window.innerWidth - 0.5) * 10}deg) rotateX(${(mousePosition.y / window.innerHeight - 0.5) * -10}deg)` :
                  'perspective(1000px) rotateY(0deg) rotateX(0deg)',
                transition: 'transform 0.3s ease',
              }}
            >
              <div className="relative overflow-hidden p-1.5 rounded-xl mr-3 hidden sm:block">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 animate-gradient-xy"></div>
                <div className="absolute inset-0.5 bg-white dark:bg-gray-900 rounded-lg"></div>
                <img
                  className="w-7 h-7 object-contain relative z-10"
                  src="/logo/logo1.png"
                  alt="F8 Logo"
                />

                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-0"
                  animate={{ opacity: isHovering ? 0.8 : 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    filter: 'blur(15px)',
                    zIndex: 0,
                  }}
                />
              </div>

              <div>
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-bold text-lg text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 truncate max-w-[200px] md:max-w-md"
                >
                  {data?.title || "Khóa học F8"}
                </motion.h1>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="h-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                />
              </div>
            </motion.div>
          </div>

          {/* Center section: Course progress */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <Progressbar progress={progress} />
          </div>

          {/* Right section: Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {/* Notification button */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-md hover:shadow-lg transition-all duration-300 relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifications(!showNotifications);
                  setShowDropdown(false);
                }}
              >
                <FiBell className="text-xl" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </motion.button>

              {/* Notifications dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden z-50"
                    style={{
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200">Thông báo</h3>
                        <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 rounded-full">
                          {notifications.filter(n => n.isNew).length} mới
                        </span>
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto">
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer ${notification.isNew ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        >
                          <div className="flex items-start">
                            <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notification.isNew ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{notification.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <div className="p-3 text-center border-t border-gray-200 dark:border-gray-700">
                      <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                        Xem tất cả thông báo
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Course actions dropdown */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05, rotate: 15 }}
                whileTap={{ scale: 0.95, rotate: 0 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                  setShowNotifications(false);
                }}
                className="p-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
              >
                <FiSettings className="text-xl" />
              </motion.button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-60 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden z-50"
                    style={{
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    }}
                  >
                    <div className="py-2">
                      <Link href="/" className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mr-3">
                          <FiHome className="text-lg" />
                        </div>
                        <span className="font-medium">Trang chủ</span>
                      </Link>

                      <Link href="/courses/my-courses" className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mr-3">
                          <FiBookOpen className="text-lg" />
                        </div>
                        <span className="font-medium">Khóa học của tôi</span>
                      </Link>

                      <Link href="/profile" className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 mr-3">
                          <FiAward className="text-lg" />
                        </div>
                        <span className="font-medium">Thành tích</span>
                      </Link>

                      <div className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 mr-3">
                          <FiCode className="text-lg" />
                        </div>
                        <span className="font-medium">Thực hành code</span>
                      </div>

                      <div className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors cursor-pointer">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mr-3">
                          <FiZap className="text-lg" />
                        </div>
                        <span className="font-medium">Thử thách</span>
                      </div>

                      <div className="h-px bg-gray-200 dark:bg-gray-700 my-2"></div>

                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          // Thêm logic báo cáo khóa học nếu cần
                        }}
                        className="w-full text-left flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mr-3">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <span className="font-medium">Báo cáo vấn đề</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className="md:hidden px-4 pb-2">
          <Progressbar progress={progress} />
        </div>
      </motion.div>

      {/* Spacer to prevent content from being hidden under fixed header */}
      <div className="h-16"></div>
    </header>
  );
};

export default Header;
