import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { IoSearchOutline, IoSettingsOutline, IoNotificationsOutline } from 'react-icons/io5';
import { FaUserFriends, FaChevronLeft } from 'react-icons/fa';
import LoadingBar from 'react-top-loading-bar';
import ModalUser from '../Header/ModalUser';
import { useAppSelector } from '@/redux/hook/hook';

const Header = () => {
  const ref = useRef<any>(null);
  const user = useAppSelector(state => state.auth.user);
  const handleGoBack = () => { };
  const handleBackHome = () => { };

  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(true);

  // Dữ liệu mẫu cho thông báo
  const mockNotifications = [
    {
      id: 1,
      type: 'friend',
      sender: 'Thanh Tùng',
      content: 'đã gửi cho bạn lời mời kết bạn',
      time: '5 phút trước',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36',
      isRead: false,
    },
    {
      id: 2,
      type: 'message',
      sender: 'Nhóm F8 NextJS',
      content: 'Tuấn đã gửi một tin nhắn mới',
      time: '15 phút trước',
      avatar: '/images/logo.png',
      isRead: true,
    },
    {
      id: 3,
      type: 'system',
      content: 'Bạn vừa đăng nhập từ một thiết bị mới',
      time: '1 giờ trước',
      isRead: true,
    }
  ];

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (hasNewNotification) {
      setHasNewNotification(false);
    }
  };

  return (
    <header>
      <LoadingBar color="#0066df" ref={ref} />
      <div className="fixed top-0 left-0 w-full h-[5rem] border-b bg-white flex justify-between items-center px-5 shadow-sm z-50">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <img src="/images/logo.png" alt="Logo" className="h-10 w-10 mr-2" />
            <span className="text-[1.8rem] font-semibold">F8 Chat</span>
          </Link>
        </div>
        <div className="flex items-center">
          <button className="p-2 mx-1 rounded-full hover:bg-gray-100 transition-colors">
            <IoSearchOutline className="text-[2.2rem]" />
          </button>
          <button className="p-2 mx-1 rounded-full hover:bg-gray-100 transition-colors">
            <FaUserFriends className="text-[2.2rem]" />
          </button>
          <div className="relative">
            <button
              className="p-2 mx-1 rounded-full hover:bg-gray-100 transition-colors"
              onClick={toggleNotifications}
            >
              <div className="relative">
                <IoNotificationsOutline className="text-[2.2rem]" />
                {hasNewNotification && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </div>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20 border">
                <div className="p-3 border-b">
                  <h3 className="text-[1.6rem] font-medium">Thông báo</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {mockNotifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                    >
                      <div className="flex">
                        {notification.avatar ? (
                          <img
                            src={notification.avatar}
                            alt="Avatar"
                            className="w-12 h-12 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <span className="text-blue-500 text-[1.8rem]">F8</span>
                          </div>
                        )}
                        <div>
                          <div className="text-[1.4rem]">
                            {notification.sender && <span className="font-medium">{notification.sender} </span>}
                            {notification.content}
                          </div>
                          <div className="text-[1.2rem] text-gray-500">{notification.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 text-center">
                  <button className="text-blue-500 text-[1.4rem] hover:underline">
                    Xem tất cả
                  </button>
                </div>
              </div>
            )}
          </div>
          <button className="p-2 mx-1 rounded-full hover:bg-gray-100 transition-colors">
            <IoSettingsOutline className="text-[2.2rem]" />
          </button>
          <div className="ml-2">
            <img
              src="https://images.unsplash.com/photo-1599566150163-29194dcaad36"
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-gray-200"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
