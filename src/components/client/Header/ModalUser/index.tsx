'use client';
import { useRef, useState } from 'react';
import { IoNotificationsOutline, IoBookmarkOutline } from 'react-icons/io5';
import 'tippy.js/dist/tippy.css';
import ModalInfo from './ModaInfo';
import { useOutsideClick } from '@/hook/useOutsideClick';
import Tippy from '@tippyjs/react';
import LoadingBar from 'react-top-loading-bar';
import { motion } from '@/lib/motion';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/redux/hook/hook';
import NotificationsPopup from '../NotificationsPopup';
import MyCoursesPopup from '../MyCoursesPopup';

const ModalUser = ({ data }: any) => {
  const [visible, setVisible] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMyCourses, setShowMyCourses] = useState(false);
  const ref = useRef<any>(null);
  const router = useRouter();

  // Get notification count from Redux
  const notifications = useAppSelector(state => state.noti.notifications);
  const notificationCount = notifications ? notifications.filter((n: any) => !n.isRead).length : 0;

  const handleCloseMenu = () => {
    setVisible(false);
  };

  const handleCloseAllPopups = () => {
    setShowNotifications(false);
    setShowMyCourses(false);
  };

  const menuRef = useOutsideClick(handleCloseMenu);
  const notificationsRef = useOutsideClick(() => setShowNotifications(false));
  const myCoursesRef = useOutsideClick(() => setShowMyCourses(false));
  const mainRef = useOutsideClick(handleCloseAllPopups);

  const handleMyCourses = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMyCourses(prev => !prev);
    setShowNotifications(false);
  };

  const handleNotificationsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNotifications(prev => !prev);
    setShowMyCourses(false);
  };

  return (
    <div ref={mainRef} className="flex items-center space-x-4">
      <LoadingBar color="#6366f1" ref={ref} height={2} />

      {/* My Courses Button */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="hidden md:flex items-center text-indigo-100 hover:text-white transition-colors px-2 py-1 rounded-full hover:bg-indigo-700/30"
          onClick={handleMyCourses}
        >
          <IoBookmarkOutline className="text-xl mr-1.5" />
          <span className="text-sm font-medium">Khoá học của tôi</span>
        </motion.button>

        {showMyCourses && (
          <div
            ref={myCoursesRef}
            className="absolute top-10 right-0 z-50 mt-1"
          >
            <div className="w-3 h-3 absolute -top-1.5 right-12 bg-white dark:bg-gray-800 rotate-45 border-t border-l border-gray-200 dark:border-gray-700"></div>
            <MyCoursesPopup onClose={() => setShowMyCourses(false)} />
          </div>
        )}
      </div>

      {/* Notifications Button */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNotificationsClick}
          className="flex items-center justify-center w-9 h-9 text-indigo-100 hover:text-white rounded-full hover:bg-indigo-700/30 transition-all relative"
          aria-label="Notifications"
        >
          <IoNotificationsOutline className="text-xl" />
          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </motion.button>

        {showNotifications && (
          <div
            ref={notificationsRef}
            className="absolute top-10 right-0 z-50 mt-1"
          >
            <div className="w-3 h-3 absolute -top-1.5 right-4 bg-white dark:bg-gray-800 rotate-45 border-t border-l border-gray-200 dark:border-gray-700"></div>
            <NotificationsPopup onClose={() => setShowNotifications(false)} />
          </div>
        )}
      </div>

      {/* User Avatar */}
      <Tippy
        className="tippy-custom"
        arrow={false}
        content={
          <div ref={menuRef} className="transition ease-in-out duration-300">
            <ModalInfo refInfo={ref} data={data} />
          </div>
        }
        interactive={true}
        placement="bottom-end"
        trigger="click"
        popperOptions={{
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                padding: 10,
              },
            },
          ],
        }}
        theme="transparent"
        appendTo="parent"
      >
        <div className="flex items-center cursor-pointer">
          <div className="relative">
            <img
              className="object-cover h-9 w-9 rounded-full border-2 border-indigo-300/50 hover:border-indigo-300 transition-all"
              src={
                data?.user?.avatar ||
                'https://st.depositphotos.com/1779253/5140/v/450/depositphotos_51402559-stock-illustration-avatar-internet-social-profile-vector.jpg'
              }
              alt="User avatar"
            />
            <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-indigo-700"></div>
          </div>
        </div>
      </Tippy>
    </div>
  );
};

export default ModalUser;
