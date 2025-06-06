'use client';
import Link from 'next/link';
import { MdOutlineDashboard, MdBarChart, MdMenu, MdClose, MdDarkMode, MdLightMode } from 'react-icons/md';
import { LuUser, LuSettings, LuLogOut } from 'react-icons/lu';
import { AiOutlineCopyright } from 'react-icons/ai';
import { RiUser3Line, RiRouteLine } from 'react-icons/ri';
import { BsBook, BsCreditCard } from 'react-icons/bs';
import { FaChalkboardTeacher } from 'react-icons/fa';
import { IoNotificationsOutline } from 'react-icons/io5';
import { FiFileText } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const menuItems = [
  {
    id: 1,
    url: '/admin',
    name: 'Tổng quan',
    icon: <MdOutlineDashboard className="text-xl" />,
    description: 'Dữ liệu tổng quan hệ thống',
  },
  {
    id: 2,
    url: '/admin/users',
    name: 'Người dùng',
    icon: <LuUser className="text-xl" />,
    description: 'Quản lý tài khoản người dùng',
  },
  {
    id: 3,
    url: '/admin/course',
    name: 'Khóa học',
    icon: <BsBook className="text-xl" />,
    description: 'Quản lý khóa học và nội dung',
  },
  {
    id: 4,
    url: '/admin/learning-paths',
    name: 'Lộ trình học',
    icon: <RiRouteLine className="text-xl" />,
    description: 'Quản lý lộ trình học tập',
  },
  {
    id: 5,
    url: '/admin/posts',
    name: 'Bài viết',
    icon: <FiFileText className="text-xl" />,
    description: 'Quản lý và duyệt bài viết',
  },
  {
    id: 6,
    url: '/admin/statistics',
    name: 'Thống kê',
    icon: <MdBarChart className="text-xl" />,
    description: 'Báo cáo và phân tích dữ liệu',
  },
  {
    id: 7,
    url: '/admin/payments',
    name: 'Thanh toán',
    icon: <BsCreditCard className="text-xl" />,
    description: 'Quản lý giao dịch và doanh thu',
  },
  {
    id: 8,
    url: '/admin/account',
    name: 'Tài khoản',
    icon: <RiUser3Line className="text-xl" />,
    description: 'Quản lý tài khoản cá nhân',
  },
];

interface SidebarProps {
  onToggle?: (isCollapsed: boolean) => void;
}

export default function Sidebar({ onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Detect active menu item based on current path
  const getActiveMenuItem = () => {
    return menuItems.map(item => ({
      ...item,
      isActive: pathname.startsWith(item.url),
    }));
  };

  const [menuState, setMenuState] = useState(getActiveMenuItem());

  useEffect(() => {
    setMenuState(getActiveMenuItem());
  }, [pathname]);

  const handleNavigate = (url: string) => {
    router.push(url);
  };

  // Handle collapse state and notify parent component
  const handleToggleCollapse = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, type: "spring", stiffness: 300, damping: 30 }}
      className={`${collapsed ? 'w-16' : 'w-64'} h-screen fixed transition-all duration-300 ease-in-out flex flex-col z-30`}
    >
      <div className={`h-full backdrop-blur-xl ${isDark ? 'bg-slate-900/80' : 'bg-white/80'} border-r ${isDark ? 'border-slate-700/50' : 'border-gray-200/70'}`}>
        <div className={`p-4 flex items-center justify-between h-16 border-b ${isDark ? 'border-slate-700/50' : 'border-gray-200/70'}`}>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">F8</span>
            </div>
            {!collapsed && (
              <motion.h1
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className={`text-base font-semibold ml-3 ${isDark ? 'text-white' : 'text-gray-800'}`}
              >
                Admin Dashboard
              </motion.h1>
            )}
          </div>
          <button
            className={`p-1.5 rounded-lg ${isDark ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-all`}
            onClick={handleToggleCollapse}
          >
            {collapsed ? (
              <MdMenu className="text-lg" />
            ) : (
              <MdClose className="text-lg" />
            )}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 modern-scrollbar">
          <ul className="space-y-1 px-3">
            {menuState.map((item) => (
              <motion.li
                key={item.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => handleNavigate(item.url)}
                  className={`w-full flex items-center py-2.5 px-3 rounded-xl relative group ${item.isActive
                      ? isDark
                        ? 'bg-slate-800/70 text-white'
                        : 'bg-blue-50 text-blue-700'
                      : isDark
                        ? 'text-gray-300 hover:bg-slate-800/50'
                        : 'text-gray-700 hover:bg-gray-100'
                    } transition-all duration-200`}
                  title={collapsed ? item.name : ''}
                >
                  <span className={`flex items-center justify-center ${collapsed ? 'w-7 h-7' : 'w-6 h-6'} ${item.isActive
                      ? isDark
                        ? 'text-blue-400'
                        : 'text-blue-600'
                      : isDark
                        ? 'text-gray-400'
                        : 'text-gray-500'
                    }`}>
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="ml-3 text-left"
                    >
                      <span className={`text-sm font-medium block ${item.isActive
                          ? isDark
                            ? 'text-white'
                            : 'text-blue-700'
                          : isDark
                            ? 'text-gray-300'
                            : 'text-gray-700'
                        }`}>
                        {item.name}
                      </span>
                      <span className={`text-xs font-normal block mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                        {item.description}
                      </span>
                    </motion.div>
                  )}

                  {item.isActive && (
                    <motion.div
                      className={`absolute left-0 top-0 w-1 h-full ${isDark ? 'bg-blue-500' : 'bg-blue-600'} rounded-r`}
                      layoutId="activeIndicator"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  {collapsed && (
                    <div className={`absolute left-full ml-2 px-2 py-1 ${isDark ? 'bg-slate-800' : 'bg-white'
                      } text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap hidden lg:block z-50 shadow-lg`}>
                      {item.name}
                    </div>
                  )}
                </button>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className={`border-t ${isDark ? 'border-slate-700/50' : 'border-gray-200/70'} p-3`}>
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg w-full flex items-center justify-center ${isDark
                  ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } transition-all`}
            >
              {isDark ? (
                <div className="flex items-center">
                  {!collapsed && <span className="mr-2 text-xs">Chế độ sáng</span>}
                  <MdLightMode className="text-lg" />
                </div>
              ) : (
                <div className="flex items-center">
                  {!collapsed && <span className="mr-2 text-xs">Chế độ tối</span>}
                  <MdDarkMode className="text-lg" />
                </div>
              )}
            </button>
          </div>

          <div
            className={`flex items-center ${collapsed ? 'justify-center' : ''} cursor-pointer ${isDark
                ? 'hover:bg-slate-800 text-gray-300'
                : 'hover:bg-gray-100 text-gray-700'
              } p-2 rounded-lg transition-all duration-200`}
            onClick={() => router.push('/')}
          >
            <LuLogOut className="text-lg" />
            {!collapsed && <span className="ml-3 text-sm font-medium">Về trang chủ</span>}
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
