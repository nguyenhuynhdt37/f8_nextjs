'use client';

import React, { useEffect, useState } from 'react';
import { motion } from '@/lib/motion';
import { FaBell, FaCircleNotch, FaFilter, FaSearch, FaCheckDouble } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useAppSelector, useAppDispatch } from '@/redux/hook/hook';
import { markAsRead, markAllAsRead, deleteNotification } from '@/redux/reducers/slices/NotificationSlice';

// Mock data for demonstration - would be replaced with actual API calls
const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        type: 'course_update',
        title: 'Khóa học HTML CSS Pro',
        message: 'Bài học mới "Làm dự án thực tế" đã được cập nhật',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        read: false,
        image: '/images/logo.png'
    },
    {
        id: '2',
        type: 'comment_reply',
        title: 'Nguyễn Văn A',
        message: 'đã trả lời bình luận của bạn: "Cảm ơn bạn về lời khuyên..."',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        read: true,
        image: '/images/avatar-empty.png'
    },
    {
        id: '3',
        type: 'new_blog',
        title: 'Bài viết mới',
        message: '"10 mẹo tăng hiệu suất làm việc với JavaScript" đã được xuất bản',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true,
        image: '/images/logo.png'
    },
    {
        id: '4',
        type: 'system_update',
        title: 'Hệ thống',
        message: 'Tính năng live streaming đã được cập nhật trên nền tảng F8',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        read: true,
        image: '/images/logo.png'
    },
    {
        id: '5',
        type: 'course_update',
        title: 'Khóa học JavaScript Nâng Cao',
        message: 'Bài học mới về Async/Await đã được cập nhật',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        read: false,
        image: '/images/logo.png'
    },
    {
        id: '6',
        type: 'achievement',
        title: 'Chúc mừng!',
        message: 'Bạn đã hoàn thành 50% khóa học ReactJS Cơ Bản',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        read: true,
        image: '/images/logo.png'
    },
    {
        id: '7',
        type: 'promotion',
        title: 'Khuyến mãi',
        message: 'Black Friday: Giảm giá 50% tất cả các khóa học PRO trong 24h',
        timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
        read: true,
        image: '/images/logo.png'
    },
    {
        id: '8',
        type: 'new_course',
        title: 'Khóa học mới',
        message: 'Next.js 14 - Xây dựng ứng dụng fullstack hiện đại đã ra mắt',
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        read: true,
        image: '/images/logo.png'
    }
];

export default function NotificationsClient() {
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [searchTerm, setSearchTerm] = useState('');

    // Get notifications from Redux
    const reduxNotifications = useAppSelector(state => state.noti.notifications);
    const dispatch = useAppDispatch();

    // Format notifications for display
    const notifications = reduxNotifications.map((notification: any) => ({
        id: notification.entityId || String(notification.id),
        type: notification.entityType || 'system',
        title: notification.title,
        message: notification.message,
        timestamp: notification.createdAt,
        read: notification.isRead,
        image: notification.extraData?.avatar || '/images/logo.png'
    }));

    useEffect(() => {
        // Simulate API fetch
        const fetchNotifications = async () => {
            setLoading(true);
            // Here you would make an actual API call to get the user's notifications
            setTimeout(() => {
                dispatch({ type: 'noti/setNotifications', payload: MOCK_NOTIFICATIONS });
                setLoading(false);
            }, 800);
        };

        fetchNotifications();
    }, [dispatch]);

    const handleReadAll = () => {
        dispatch(markAllAsRead());
        // Here you would also call an API to mark all notifications as read
    };

    const handleReadNotification = (id: string) => {
        dispatch(markAsRead(id));
        // Here you would also call an API to mark a single notification as read
    };

    const handleDeleteNotification = (id: string) => {
        dispatch(deleteNotification(id));
        // Here you would also call an API to delete a notification
    };

    const filteredNotifications = notifications.filter(notification => {
        // Apply search filter
        const searchContent = `${notification.title} ${notification.message}`.toLowerCase();
        if (searchTerm && !searchContent.includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Apply read status filter
        if (filter === 'unread' && notification.read) {
            return false;
        }
        if (filter === 'read' && !notification.read) {
            return false;
        }

        return true;
    });

    const formatTime = (timestamp: string) => {
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
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-5xl">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-5xl font-bold text-gray-800">Thông báo</h1>

                {notifications.some(n => !n.read) && (
                    <button
                        className="flex items-center px-6 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xl"
                        onClick={handleReadAll}
                    >
                        <FaCheckDouble className="mr-3 text-2xl" />
                        <span>Đánh dấu tất cả đã đọc</span>
                    </button>
                )}
            </div>

            {/* Search and filter */}
            <div className="mb-10 flex flex-col md:flex-row gap-5">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Tìm kiếm thông báo..."
                        className="w-full pl-14 pr-5 py-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                </div>

                <div className="relative">
                    <select
                        className="appearance-none pl-14 pr-14 py-5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-xl"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">Tất cả thông báo</option>
                        <option value="unread">Chưa đọc</option>
                        <option value="read">Đã đọc</option>
                    </select>
                    <FaFilter className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
                </div>
            </div>

            {/* Notifications list */}
            {loading ? (
                <div className="flex justify-center items-center h-80">
                    <FaCircleNotch className="animate-spin text-5xl text-blue-600" />
                </div>
            ) : filteredNotifications.length > 0 ? (
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {filteredNotifications.map((notification, index) => (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-6 border-b border-gray-100 flex group ${!notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                            onClick={() => !notification.read && handleReadNotification(notification.id)}
                        >
                            <div className="flex-shrink-0 mr-5">
                                <img src={notification.image} alt="" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-lg">
                                    <span className="font-medium text-gray-900">{notification.title}</span> - {notification.message}
                                </p>
                                <p className="text-base text-gray-500 mt-2">{formatTime(notification.timestamp)}</p>
                            </div>

                            <div className="ml-4 flex items-start">
                                {!notification.read && (
                                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 mr-3"></div>
                                )}
                                <button
                                    className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteNotification(notification.id);
                                    }}
                                >
                                    <IoClose className="text-2xl" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-lg">
                    <FaBell className="mx-auto text-5xl text-gray-400 mb-6" />
                    <h3 className="text-2xl font-medium text-gray-700 mb-3">Không có thông báo nào</h3>
                    <p className="text-gray-500 text-xl">
                        {searchTerm ? 'Thử tìm kiếm với từ khóa khác.' : 'Bạn sẽ nhận được thông báo khi có cập nhật mới.'}
                    </p>
                </div>
            )}
        </div>
    );
}
