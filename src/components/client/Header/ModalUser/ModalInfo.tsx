'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { useRouter } from 'next/navigation';
import { FaUserCircle, FaSignOutAlt, FaCog, FaBell, FaChalkboardTeacher, FaCertificate, FaCheckDouble } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '@/redux/hook/hook';
import { markAllAsRead } from '@/redux/reducers/slices/NotificationSlice';

const ModalInfo = ({ refInfo, data }: any) => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('account'); // 'account', 'notifications', 'courses'

    // Get notifications from Redux
    const dispatch = useAppDispatch();
    const reduxNotifications = useAppSelector(state => state.noti.notifications);
    const notificationCount = reduxNotifications.filter((n: any) => !n.isRead).length;

    // Format notifications for display
    const notifications = reduxNotifications.slice(0, 4).map((notification: any) => ({
        id: notification.entityId || Math.random().toString(),
        title: notification.title,
        message: notification.message,
        time: formatTimeAgo(notification.createdAt),
        read: notification.isRead,
        image: notification.extraData?.avatar || '/images/logo.png'
    }));

    // Helper function to format timestamps
    function formatTimeAgo(timestamp: string) {
        if (!timestamp) return 'gần đây';

        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) {
            return `${diffMins} phút trước`;
        } else if (diffHours < 24) {
            return `${diffHours} giờ trước`;
        } else if (diffDays < 30) {
            return `${diffDays} ngày trước`;
        } else {
            return date.toLocaleDateString('vi-VN');
        }
    }

    const handleLogout = async () => {
        refInfo.current.continuousStart();
        router.push('/');
    };

    const handleRedirect = (path: string) => {
        refInfo.current.continuousStart();
        router.push(path);
    };

    const handleMarkAllRead = () => {
        dispatch(markAllAsRead());
        // In a real app, you would also make an API call to mark all as read
    };

    // Mock courses data (would come from an API in a real app)
    const courses = [
        {
            id: '123',
            title: 'HTML CSS Pro',
            progress: 70,
            color: 'blue'
        },
        {
            id: '456',
            title: 'JavaScript Cơ Bản',
            progress: 45,
            color: 'green'
        },
        {
            id: '789',
            title: 'ReactJS Nâng Cao',
            progress: 25,
            color: 'red'
        }
    ];

    return (
        <div className="bg-white w-[450px] rounded-xl overflow-hidden shadow-xl border border-gray-200">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    className={`flex-1 py-4 font-medium text-center text-lg ${activeTab === 'account' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('account')}
                >
                    Tài khoản
                </button>
                <button
                    className={`flex-1 py-4 font-medium text-center relative text-lg ${activeTab === 'notifications' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('notifications')}
                >
                    Thông báo
                    {notificationCount > 0 && (
                        <span className="absolute top-2 right-5 min-w-[22px] h-[22px] flex items-center justify-center bg-red-500 rounded-full">
                            <span className="text-xs text-white font-medium px-1">{notificationCount}</span>
                        </span>
                    )}
                </button>
                <button
                    className={`flex-1 py-4 font-medium text-center text-lg ${activeTab === 'courses' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
                    onClick={() => setActiveTab('courses')}
                >
                    Khóa học
                </button>
            </div>

            <AnimatePresence mode="wait">
                {/* Account Tab */}
                {activeTab === 'account' && (
                    <motion.div
                        key="account"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="p-4"
                    >
                        <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
                            <img
                                src={data?.user?.avatar || '/images/avatar-empty.png'}
                                alt="Profile"
                                className="w-20 h-20 rounded-full object-cover border-2 border-blue-100"
                            />
                            <div className="ml-4">
                                <h3 className="font-semibold text-xl">{data?.user?.fullName || 'Chưa cập nhật'}</h3>
                                <p className="text-gray-500 text-base">{data?.user?.email || 'Chưa cập nhật email'}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <motion.button
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 text-gray-700 text-base"
                                onClick={() => handleRedirect(`/profile/${data?.user?.id}`)}
                            >
                                <FaUserCircle className="mr-4 text-gray-500 text-xl" />
                                <span>Xem hồ sơ</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 text-gray-700 text-base"
                                onClick={() => handleRedirect(`/profile/${data?.user?.id}?tab=settings`)}
                            >
                                <FaCog className="mr-4 text-gray-500 text-xl" />
                                <span>Cài đặt</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 text-gray-700 text-base"
                                onClick={() => handleRedirect(`/profile/${data?.user?.id}?tab=certificates`)}
                            >
                                <FaCertificate className="mr-4 text-gray-500 text-xl" />
                                <span>Chứng chỉ</span>
                            </motion.button>

                            <motion.button
                                whileHover={{ x: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="flex items-center w-full p-3 rounded-lg hover:bg-gray-50 text-red-500 mt-6 text-base"
                                onClick={handleLogout}
                            >
                                <FaSignOutAlt className="mr-4 text-xl" />
                                <span>Đăng xuất</span>
                            </motion.button>
                        </div>
                    </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                    <motion.div
                        key="notifications"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="max-h-[400px] overflow-y-auto"
                    >
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 sticky top-0 z-10 flex justify-between items-center">
                            <h3 className="font-medium text-lg">Thông báo gần đây</h3>
                            {notificationCount > 0 && (
                                <button
                                    className="text-blue-600 text-base hover:underline flex items-center"
                                    onClick={handleMarkAllRead}
                                >
                                    <FaCheckDouble className="mr-1" />
                                    <span>Đánh dấu đã đọc</span>
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="divide-y divide-gray-100">
                            {notifications.length > 0 ? (
                                <>
                                    {notifications.map((notification, index) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className={`p-5 ${!notification.read ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-100'} cursor-pointer transition-colors`}
                                            onClick={() => handleRedirect(`/notifications`)}
                                        >
                                            <div className="flex">
                                                <div className="flex-shrink-0 mr-4">
                                                    <img src={notification.image} alt="Notification" className="w-12 h-12 rounded-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-base text-gray-900">
                                                        <span className="font-medium">{notification.title}</span> - {notification.message}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-2">{notification.time}</p>
                                                </div>
                                                {!notification.read && (
                                                    <div className="ml-2">
                                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    <FaBell className="mx-auto text-gray-300 text-5xl mb-3" />
                                    <p className="text-lg">Không có thông báo nào</p>
                                </div>
                            )}

                            <div className="p-4 bg-gray-50 text-center">
                                <button
                                    className="text-blue-600 text-base hover:underline"
                                    onClick={() => handleRedirect('/notifications')}
                                >
                                    Xem tất cả thông báo
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                    <motion.div
                        key="courses"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="max-h-[400px] overflow-y-auto"
                    >
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                            <h3 className="font-medium text-lg">Khóa học đã đăng ký</h3>
                        </div>

                        {/* Courses List */}
                        <div className="divide-y divide-gray-100">
                            {courses.length > 0 ? (
                                <>
                                    {courses.map((course, index) => (
                                        <motion.div
                                            key={course.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="p-5 hover:bg-gray-100 cursor-pointer transition-colors"
                                            onClick={() => handleRedirect(`/learning/${course.id}`)}
                                        >
                                            <div className="flex">
                                                <div className="flex-shrink-0 mr-4">
                                                    <div className={`w-16 h-14 rounded-lg overflow-hidden relative bg-gradient-to-r from-${course.color}-500 to-${course.color === 'blue' ? 'purple' : course.color === 'green' ? 'teal' : 'orange'}-600`}>
                                                        <FaChalkboardTeacher className="absolute inset-0 m-auto text-white text-2xl" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base font-medium text-gray-900 line-clamp-1">{course.title}</h4>
                                                    <div className="mt-2 flex items-center">
                                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                                            <div
                                                                className={`bg-${course.color}-600 h-3 rounded-full`}
                                                                style={{ width: `${course.progress}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="ml-2 text-sm text-gray-500">{course.progress}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    <FaChalkboardTeacher className="mx-auto text-gray-300 text-5xl mb-3" />
                                    <p className="text-lg">Bạn chưa đăng ký khóa học nào</p>
                                </div>
                            )}

                            <div className="p-4 bg-gray-50 text-center">
                                <button
                                    className="text-blue-600 text-base hover:underline"
                                    onClick={() => handleRedirect('/courses/my-courses')}
                                >
                                    Xem tất cả khóa học
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ModalInfo;
