'use client';

import { useAppSelector } from '@/redux/hook/hook';
import { useRouter } from 'next/navigation';
import { createRef, useState, useEffect, useRef } from 'react';
import LoadingBar from 'react-top-loading-bar';
import { IoNotificationsOutline, IoSearchOutline } from 'react-icons/io5';
import { RiUser3Line } from 'react-icons/ri';
import { LuLogOut, LuSettings, LuBell } from 'react-icons/lu';
import { MdOutlineHelp } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  collapsed?: boolean;
}

const Header = ({ collapsed }: HeaderProps) => {
  const ref = createRef<any>();
  const user = useAppSelector(state => state.auth.user?.user);
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleRedirectHome = () => {
    ref.current.continuousStart();
    router.push('/');
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Example notifications
  const notifications = [
    {
      id: 1,
      title: 'Khóa học mới',
      message: 'Khóa học "ReactJS nâng cao" vừa được thêm vào hệ thống',
      time: '5 phút trước',
      unread: true,
      type: 'course',
    },
    {
      id: 2,
      title: 'Thanh toán thành công',
      message: 'Người dùng Nguyễn Văn A đã thanh toán khóa học JavaScript',
      time: '30 phút trước',
      unread: true,
      type: 'payment',
    },
    {
      id: 3,
      title: 'Báo cáo hàng tuần',
      message: 'Báo cáo thống kê tuần vừa qua đã được cập nhật',
      time: 'Hôm qua',
      unread: false,
      type: 'report',
    },
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'course':
        return <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
          </svg>
        </div>;
      case 'payment':
        return <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h8zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H4z" />
            <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-2zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-4z" />
          </svg>
        </div>;
      default:
        return <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
          </svg>
        </div>;
    }
  };

  return (
    <>
      <LoadingBar color="#3b82f6" height={3} ref={ref} />
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`h-16 fixed right-0 top-0 left-0 transition-all duration-300 z-40 ${collapsed ? 'left-16' : 'left-64'}`}
      >
        <div className={`w-full h-full ${isDark ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-xl border-b ${isDark ? 'border-slate-700/50' : 'border-gray-200/70'} flex justify-between items-center px-6`}>
          {/* Search bar */}
          <motion.div
            className="hidden md:flex items-center relative w-72"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className={`absolute left-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <IoSearchOutline size={18} />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className={`py-2 pl-10 pr-4 w-full border ${isDark
                  ? 'border-slate-700 bg-slate-800/50 text-gray-200 focus:border-blue-500'
                  : 'border-gray-200 bg-gray-50 text-gray-700 focus:border-blue-400'
                } rounded-xl text-sm focus:outline-none focus:ring-2 ${isDark ? 'focus:ring-blue-500/20' : 'focus:ring-blue-400/30'
                } transition-all`}
            />
          </motion.div>

          {/* Right side elements */}
          <motion.div
            className="flex items-center space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-2 ${isDark
                    ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } rounded-lg cursor-pointer transition-all flex items-center justify-center`}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <LuBell size={18} className={isDark ? 'text-gray-300' : 'text-gray-700'} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full flex items-center justify-center">
                </span>
              </motion.button>

              {/* Notifications dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={`absolute right-0 mt-2 w-80 ${isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-gray-200'
                      } rounded-xl shadow-lg border py-2 z-50 overflow-hidden`}
                  >
                    <div className={`px-4 py-2 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'} flex justify-between items-center`}>
                      <h3 className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>Thông báo</h3>
                      <span className="text-xs text-blue-500 cursor-pointer hover:text-blue-600 transition-colors font-medium">Đánh dấu đã đọc</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto modern-scrollbar">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className={`px-4 py-3 ${isDark
                              ? 'hover:bg-slate-700/50'
                              : 'hover:bg-gray-50'
                            } cursor-pointer border-l-2 ${notification.unread
                              ? 'border-blue-500'
                              : isDark
                                ? 'border-slate-700'
                                : 'border-transparent'
                            }`}
                        >
                          <div className="flex items-start">
                            {getNotificationIcon(notification.type)}
                            <div className="ml-3 flex-1">
                              <p className={`text-sm ${notification.unread
                                  ? isDark
                                    ? 'font-medium text-gray-200'
                                    : 'font-medium text-gray-800'
                                  : isDark
                                    ? 'font-normal text-gray-300'
                                    : 'font-normal text-gray-700'
                                }`}>
                                {notification.title}
                              </p>
                              <p className={`text-xs mt-0.5 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                {notification.message}
                              </p>
                              <p className={`text-xs mt-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className={`px-4 py-2 border-t ${isDark ? 'border-slate-700' : 'border-gray-100'} text-center`}>
                      <button className="text-xs text-blue-500 hover:text-blue-600 transition-colors font-medium">
                        Xem tất cả thông báo
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User profile */}
            <div className="relative" ref={userMenuRef}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`flex items-center space-x-3 cursor-pointer py-2 px-3 rounded-lg ${isDark
                    ? 'hover:bg-slate-800'
                    : 'hover:bg-gray-100'
                  } transition-all`}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="font-medium hidden md:block">
                  <div className="flex items-center">
                    <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'} font-medium`}>{user?.fullName || 'Admin'}</span>
                  </div>
                  <p className="text-xs text-blue-500 font-medium">Quản trị viên</p>
                </div>
                <div className={`p-0.5 inline-flex ${isDark ? 'bg-slate-800' : 'bg-white'} rounded-lg shadow-sm`}>
                  <img
                    className="w-8 h-8 rounded-lg object-cover"
                    src={
                      user?.avatar ||
                      'https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg'
                    }
                    alt="User avatar"
                  />
                </div>
              </motion.div>

              {/* Dropdown menu */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    className={`absolute right-0 mt-2 w-60 ${isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-white border-gray-200'
                      } rounded-xl shadow-lg border py-2 z-50 overflow-hidden`}
                  >
                    <div className={`px-4 py-3 border-b ${isDark ? 'border-slate-700' : 'border-gray-100'} ${isDark ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{user?.fullName || 'Admin'}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>{user?.email || 'admin@example.com'}</p>
                    </div>
                    <ul className="py-2">
                      {[
                        { icon: <RiUser3Line size={16} />, label: 'Hồ sơ cá nhân', href: '#' },
                        { icon: <LuSettings size={16} />, label: 'Cài đặt', href: '#' },
                        { icon: <MdOutlineHelp size={16} />, label: 'Trợ giúp', href: '#' }
                      ].map((item, index) => (
                        <motion.li key={index} whileHover={{ x: 3 }}>
                          <a
                            href={item.href}
                            className={`flex items-center px-4 py-2 ${isDark
                                ? 'hover:bg-slate-700/50'
                                : 'hover:bg-gray-50'
                              } transition-all group`}
                          >
                            <span className={`w-8 h-8 rounded-lg ${isDark
                                ? 'bg-slate-700 text-gray-300 group-hover:bg-blue-900/30 group-hover:text-blue-400'
                                : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600'
                              } flex items-center justify-center transition-colors`}>
                              {item.icon}
                            </span>
                            <span className={`ml-3 text-sm ${isDark
                                ? 'text-gray-300 group-hover:text-gray-200'
                                : 'text-gray-700 group-hover:text-gray-900'
                              }`}>
                              {item.label}
                            </span>
                          </a>
                        </motion.li>
                      ))}
                    </ul>
                    <div className={`px-4 pt-2 pb-3 border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`}>
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleRedirectHome}
                        className={`flex items-center w-full py-2 px-3 rounded-lg ${isDark
                            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                            : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                          } transition-all text-white text-sm font-medium`}
                      >
                        <LuLogOut size={16} />
                        <span className="ml-2">Về trang chủ</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.header>
    </>
  );
};

export default Header;
