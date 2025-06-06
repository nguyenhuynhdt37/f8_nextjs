'use client';
import MyContext from '@/hook/context';
import { RiAdminFill } from 'react-icons/ri';
import { useAppDispatch, useAppSelector } from '@/redux/hook/hook';
import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { IoIosChatbubbles } from 'react-icons/io';
import { IoHomeOutline, IoHome, IoNewspaperOutline, IoNewspaper, IoChevronForward } from 'react-icons/io5';
import { FaRoad } from 'react-icons/fa6';
import { TbRoad } from 'react-icons/tb';
import { BsChatDots, BsChatDotsFill } from 'react-icons/bs';
import LoadingBar from 'react-top-loading-bar';

const Slider = () => {
  const router = useRouter();
  const ref = useRef<any>(null);
  const state = useAppSelector(state => state.nav.state);
  const user = useAppSelector(state => state.auth?.user?.user);
  const [isExpanded, setIsExpanded] = useState(false);

  // Emit custom event when sidebar state changes
  useEffect(() => {
    const event = new CustomEvent('sidebarStateChange', {
      detail: { expanded: isExpanded }
    });
    window.dispatchEvent(event);
  }, [isExpanded]);

  const handleRedirect = async (id: number) => {
    ref.current.continuousStart();

    switch (id) {
      case 1:
        router.push('/');
        break;
      case 2:
        router.push('/learning-paths');
        break;
      case 3:
        router.push('/post');
        break;
      case 4:
        router.push('/chat');
        break;
      case 5:
        router.push('/admin/users');
        break;
    }

    await new Promise(resolve => setTimeout(resolve, 200));
    ref.current.complete();
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const navItems = [
    {
      id: 1,
      title: 'Trang chủ',
      icon: state === 1 ? <IoHome className="w-5 h-5" /> : <IoHomeOutline className="w-5 h-5" />,
      active: state === 1
    },
    {
      id: 2,
      title: 'Lộ trình',
      icon: state === 2 ? <FaRoad className="w-5 h-5" /> : <TbRoad className="w-5 h-5" />,
      active: state === 2
    },
    {
      id: 3,
      title: 'Bài viết',
      icon: state === 3 ? <IoNewspaper className="w-5 h-5" /> : <IoNewspaperOutline className="w-5 h-5" />,
      active: state === 3
    }
  ];

  if (user) {
    navItems.push({
      id: 4,
      title: 'Tin nhắn',
      icon: state === 4 ? <BsChatDotsFill className="w-5 h-5" /> : <BsChatDots className="w-5 h-5" />,
      active: state === 4
    });
  }

  if (user?.roleId === 2) {
    navItems.push({
      id: 5,
      title: 'Admin',
      icon: <RiAdminFill className={`w-5 h-5 ${state === 5 ? 'text-indigo-500' : ''}`} />,
      active: state === 5
    });
  }

  return (
    <div className="relative">
      <LoadingBar color="#6366f1" ref={ref} height={2} />
      <div
        className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ease-in-out z-40 border-r border-gray-100 dark:border-gray-800 ${isExpanded ? 'w-64' : 'w-20'
          }`}
      >
        {/* Toggle button */}
        <button
          className="absolute -right-3 top-6 bg-indigo-500 text-white rounded-full p-1 shadow-md hover:bg-indigo-600 transition-colors"
          onClick={toggleSidebar}
        >
          <IoChevronForward
            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Navigation items */}
        <div className="flex flex-col items-center pt-8 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center w-full ${isExpanded ? 'px-6' : 'justify-center px-0'
                } py-3 transition-all duration-200 ${item.active
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`}
              onClick={() => handleRedirect(item.id)}
            >
              <div className={`${item.active ? 'text-indigo-600 dark:text-indigo-400' : ''}`}>
                {item.icon}
              </div>
              {isExpanded && (
                <span className={`ml-3 text-sm whitespace-nowrap transition-opacity duration-200`}>
                  {item.title}
                </span>
              )}
              {item.active && (
                <div className="absolute left-0 w-1 h-8 bg-indigo-500 rounded-r-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Bottom section */}
        {isExpanded && user && (
          <div className="absolute bottom-8 left-0 right-0 px-4">
            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex items-center space-x-3 px-2">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-900/50">
                  <img
                    src={user.avatar || "https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg"}
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{user.fullName}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Slider;
