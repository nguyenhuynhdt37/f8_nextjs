'use client';
import Link from 'next/link';
import Image from 'next/image';
import { MdOutlineLogout } from 'react-icons/md';
import { useRef, useEffect, useState } from 'react';
import { logoutApi, getUserProfileStatistics } from '@/api/axios/api';
import { useTheme } from '@/context/ThemeContext';
import { useAppDispatch } from '@/redux/hook/hook';
import { logout } from '@/redux/reducers/slices/AuthSlice';
import { message, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import {
  FiUser,
  FiEdit,
  FiFileText,
  FiSettings,
  FiLogOut,
  FiChevronRight,
  FiSun,
  FiMoon,
  FiBook,
  FiBriefcase,
  FiBell,
  FiAward,
  FiBookmark
} from 'react-icons/fi';

const ModalInfo = ({ data, refInfo }: any) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const [userStats, setUserStats] = useState({
    enrolledCoursesCount: 0,
    postsCount: 0,
  });

  // Check for system dark mode preference on mount

  // Track mouse position for hover effects
  const handleMouseMove = (e: React.MouseEvent) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const res = await logoutApi();
      if (res?.statusCode === 200 || res?.statusCode === 201) {
        dispatch(logout());
        messageApi.open({
          content: 'Đăng xuất thành công!',
          type: 'success',
        });
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        messageApi.open({
          content: 'Có vấn đề khi đăng xuất, vui lòng thử lại sau!',
          type: 'error',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigation = (path: string) => {
    refInfo.current.continuousStart();
    router.push(path);
    refInfo.current.complete();
  };

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await getUserProfileStatistics();
        if (response.statusCode === 200) {
          setUserStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user statistics:', error);
      }
    };

    fetchUserStats();
  }, []);

  const menuItems = [
    {
      icon: <FiUser size={18} />,
      label: 'Trang cá nhân',
      onClick: () => handleNavigation('/profile'),
      color: 'text-blue-500 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      description: 'Xem và chỉnh sửa thông tin cá nhân'
    },
    {
      icon: <FiBook size={18} />,
      label: 'Khóa học của tôi',
      onClick: () => handleNavigation('/courses/my-courses'),
      color: 'text-indigo-500 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      description: 'Quản lý các khóa học đã đăng ký',
      badge: '2'
    },
    {
      icon: <FiEdit size={18} />,
      label: 'Viết bài',
      onClick: () => handleNavigation('/post/create'),
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      description: 'Tạo bài viết mới'
    },
    {
      icon: <FiFileText size={18} />,
      label: 'Bài viết của tôi',
      onClick: () => handleNavigation('/post/me'),
      color: 'text-amber-500 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      description: 'Xem và quản lý bài viết của bạn'
    },
    {
      icon: <FiBookmark size={18} />,
      label: 'Bài viết đã lưu',
      onClick: () => handleNavigation('/saved-posts'),
      color: 'text-teal-500 dark:text-teal-400',
      bgColor: 'bg-teal-100 dark:bg-teal-900/30',
      description: 'Xem và quản lý bài viết bạn đã lưu'
    },
    {
      icon: <FiBell size={18} />,
      label: 'Thông báo',
      onClick: () => handleNavigation('/notifications'),
      color: 'text-red-500 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      description: 'Xem các thông báo mới nhất',
      badge: '5',
      badgeColor: 'bg-red-500'
    },
    {
      icon: <FiAward size={18} />,
      label: 'Thành tích',
      onClick: () => handleNavigation('/achievements'),
      color: 'text-yellow-500 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      description: 'Xem thành tích và chứng chỉ',
      badge: 'Mới',
      badgeColor: 'bg-yellow-500'
    },
    {
      icon: <FiSettings size={18} />,
      label: 'Cài đặt',
      onClick: () => handleNavigation('/profile/edit'),
      color: 'text-gray-500 dark:text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-800/50',
      description: 'Tùy chỉnh tài khoản và giao diện'
    },
    {
      icon: theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />,
      label: theme === 'dark' ? 'Chế độ sáng' : 'Chế độ tối',
      onClick: toggleTheme,
      color: 'text-purple-500 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      description: 'Thay đổi giao diện hiển thị'
    },
    {
      icon: <FiLogOut size={18} />,
      label: 'Đăng xuất',
      onClick: handleLogout,
      color: 'text-rose-500 dark:text-rose-400',
      bgColor: 'bg-rose-100 dark:bg-rose-900/30',
      description: 'Đăng xuất khỏi tài khoản'
    },
  ];

  return (
    <>
      <div
        ref={modalRef}
        onMouseMove={handleMouseMove}
        className={`p-0 ${theme === 'dark' ? 'bg-gray-900 text-gray-300' : 'bg-white text-gray-600'} rounded-xl w-[300px] overflow-hidden transition-all duration-200 relative`}
        style={{
          boxShadow: theme === 'dark'
            ? '0 10px 25px rgba(0,0,0,0.3)'
            : '0 10px 25px rgba(0,0,0,0.08)',
        }}
      >
        {contextHolder}

        {/* User profile header with gradient background */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90"></div>

          <div className="relative px-4 py-4 flex items-center">
            <div className="mr-3 relative">
              <div className="w-14 h-14 overflow-hidden rounded-full shadow-md">
                <img
                  className="w-full h-full object-cover"
                  src={
                    data?.user?.avatar ||
                    'https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg'
                  }
                  alt={data?.user?.fullName || "User Avatar"}
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"></span>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="text-base text-white font-semibold truncate">
                {data?.user?.fullName}
              </div>
              <div className="text-xs text-white/80 font-medium flex items-center">
                @{data?.user?.userName}
                {data?.user?.roleId === 2 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-md text-xs font-medium">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="relative grid grid-cols-3 divide-x divide-white/10 bg-black/20 text-white">
            <div className="px-2 py-1.5 text-center hover:bg-white/10 transition-all duration-200 cursor-pointer">
              <div className="text-base font-bold">{userStats.enrolledCoursesCount}</div>
              <div className="text-[10px] opacity-80">Khóa học</div>
            </div>
            <div className="px-2 py-1.5 text-center hover:bg-white/10 transition-all duration-200 cursor-pointer">
              <div className="text-base font-bold">{userStats.postsCount}</div>
              <div className="text-[10px] opacity-80">Bài viết</div>
            </div>
            <div className="px-2 py-1.5 text-center hover:bg-white/10 transition-all duration-200 cursor-pointer">
              <div className="text-base font-bold">0</div>
              <div className="text-[10px] opacity-80">Bạn bè</div>
            </div>
          </div>
        </div>

        {/* Menu items */}
        <div
          className="py-2 px-2 max-h-[280px] overflow-y-auto"
        >
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`group flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer 
                ${activeMenu === index ? `${item.bgColor}` : ''}
                ${theme === 'dark' ? 'dark:hover:bg-gray-800' : 'hover:bg-gray-50'} 
                transition-all duration-200`}
              onClick={item.onClick}
              onMouseEnter={() => setActiveMenu(index)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div className="flex items-center">
                <div className={`${item.color} ${item.bgColor} mr-2.5 p-1.5 rounded-md`}>
                  {item.icon}
                  {item.badge && (
                    <span className={`absolute -top-1 -right-1 min-w-[16px] h-[16px] flex items-center justify-center text-xs text-white font-bold rounded-full ${item.badgeColor || 'bg-indigo-500'} px-1`}>
                      {item.badge}
                    </span>
                  )}
                </div>
                <div>
                  <span className={`text-xs ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} font-medium`}>
                    {item.label}
                  </span>
                  {activeMenu === index && (
                    <div className={`text-[10px] ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-0.5`}>
                      {item.description}
                    </div>
                  )}
                </div>
              </div>
              {isLoading && index === menuItems.length - 1 ? (
                <Spin size="small" />
              ) : (
                <FiChevronRight
                  className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}
                  size={14}
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={`px-3 py-2 text-center text-xs ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}
          style={{ borderTop: theme === 'dark' ? '1px solid rgba(75, 85, 99, 0.2)' : '1px solid rgba(243, 244, 246, 0.7)' }}>
          <span className="font-medium hover:text-blue-500 transition-colors cursor-pointer">F8 Education</span> • Học lập trình
        </div>
      </div>
    </>
  );
};

export default ModalInfo;
