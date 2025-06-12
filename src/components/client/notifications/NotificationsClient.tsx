'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import {
    FaBell,
    FaCircleNotch,
    FaFilter,
    FaSearch,
    FaRegCheckCircle,
    FaRegTrashAlt,
    FaRegClock,
    FaCheckDouble
} from 'react-icons/fa';
import { IoClose, IoFilterSharp } from 'react-icons/io5';
import { MdNotificationsActive, MdNotificationsNone } from 'react-icons/md';
import { useAppSelector, useAppDispatch } from '@/redux/hook/hook';
import {
    fetchNotifications,
    markAsReadThunk,
    markAllAsReadThunk,
    deleteNotificationThunk,
    resetNotificationState
} from '@/redux/reducers/slices/NotificationSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function NotificationsClient() {
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize] = useState(10);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<any>(null);
    const [groupedNotifications, setGroupedNotifications] = useState<any>({});
    const router = useRouter();

    // Get notifications state from Redux
    const {
        notifications,
        currentPage,
        totalPages,
        unreadCount,
        hasMore,
        loading
    } = useAppSelector(state => state.noti);

    const dispatch = useAppDispatch();

    useEffect(() => {
        // Fetch initial notifications
        dispatch(fetchNotifications({ page: 1, pageSize }));

        // Clean up on unmount
        return () => {
            dispatch(resetNotificationState());
        };
    }, [dispatch, pageSize]);

    const fetchMoreData = () => {
        if (loading || !hasMore) return;
        dispatch(fetchNotifications({
            page: currentPage + 1,
            pageSize
        }));
    };

    const handleReadAll = async () => {
        const loadingToast = toast.loading('Đánh dấu tất cả đã đọc...');
        try {
            await dispatch(markAllAsReadThunk()).unwrap();
            toast.success('Đã đánh dấu tất cả thông báo là đã đọc', { id: loadingToast });
        } catch (error) {
            toast.error('Có lỗi xảy ra khi đánh dấu đã đọc', { id: loadingToast });
        }
    };

    const handleReadNotification = async (id: number) => {
        try {
            await dispatch(markAsReadThunk(id)).unwrap();

            // If notification is selected, update its read status
            if (selectedNotification && selectedNotification.id === id) {
                setSelectedNotification({
                    ...selectedNotification,
                    isRead: true
                });
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi đánh dấu đã đọc');
        }
    };

    const handleViewNotification = (notification: any) => {
        setSelectedNotification(notification);

        // Mark as read if not already read
        if (!notification.isRead) {
            handleReadNotification(notification.id);
        }
    };

    // Extract slug from notification message
    const extractSlugFromMessage = (message: string): string | null => {
        // Look for content inside quotation marks
        const quoteMatch = message.match(/"([^"]+)"/);
        if (quoteMatch && quoteMatch[1]) {
            return convertToSlug(quoteMatch[1]);
        }
        return null;
    };

    // Convert title to slug
    const convertToSlug = (text: string): string => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[đĐ]/g, 'd')
            .replace(/[^a-z0-9\s]/g, ' ')
            .trim()
            .replace(/\s+/g, '-');
    };

    // Navigate to the appropriate page based on notification type
    const navigateToContent = (notification: any, router: any) => {
        // Mark as read if not already read
        if (!notification.isRead) {
            handleReadNotification(notification.id);
        }

        if (!notification.entityType || !notification.entityId) {
            toast.error('Không thể chuyển đến nội dung này');
            return;
        }

        switch (notification.entityType) {
            case 'Post':
                // For posts, we need the slug which might be in the message
                const slug = extractSlugFromMessage(notification.message);
                if (slug) {
                    router.push(`/post/${slug}-${notification.entityId}`);
                } else {
                    router.push(`/post/${notification.entityId}`);
                }
                break;
            case 'User':
                router.push(`/profile/${notification.entityId}`);
                break;
            case 'Course':
                router.push(`/learning/${notification.entityId}`);
                break;
            case 'Comment':
                // For comments, we might need to navigate to the post/course and scroll to the comment
                if (notification.dataId) {
                    router.push(`/learning/${notification.entityId}?comment=${notification.dataId}`);
                } else {
                    router.push(`/learning/${notification.entityId}`);
                }
                break;
            case 'FriendRequest':
                router.push(`/friends/requests`);
                break;
            default:
                router.push('/notifications');
                break;
        }
    };

    const handleDeleteNotification = async (id: number, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();

        const loadingToast = toast.loading('Đang xóa thông báo...');
        try {
            await dispatch(deleteNotificationThunk(id)).unwrap();

            // Close detail view if the deleted notification was selected
            if (selectedNotification && selectedNotification.id === id) {
                setSelectedNotification(null);
            }

            toast.success('Đã xóa thông báo', { id: loadingToast });
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa thông báo', { id: loadingToast });
        }
    };

    const handleDeleteAllRead = async () => {
        const confirmed = window.confirm('Bạn có chắc muốn xóa tất cả thông báo đã đọc?');
        if (!confirmed) return;

        const loadingToast = toast.loading('Đang xóa thông báo đã đọc...');
        try {
            // Logic: xóa tuần tự tất cả thông báo đã đọc
            const readNotifications = (notifications as any[]).filter((n: any) => n.isRead);

            if (readNotifications.length === 0) {
                toast.error('Không có thông báo đã đọc để xóa', { id: loadingToast });
                return;
            }

            let deleteCount = 0;
            for (const notification of readNotifications) {
                await dispatch(deleteNotificationThunk(notification.id)).unwrap();
                deleteCount++;
            }

            // Close detail view if a read notification was selected
            if (selectedNotification && selectedNotification.isRead) {
                setSelectedNotification(null);
            }

            toast.success(`Đã xóa ${deleteCount} thông báo đã đọc`, { id: loadingToast });
        } catch (error) {
            toast.error('Có lỗi xảy ra khi xóa thông báo', { id: loadingToast });
        }
    };

    const filteredNotifications = (notifications as any[]).filter((notification: any) => {
        // Apply search filter
        const searchContent = `${notification.title} ${notification.message}`.toLowerCase();
        if (searchTerm && !searchContent.includes(searchTerm.toLowerCase())) {
            return false;
        }

        // Apply read status filter
        if (filter === 'unread' && notification.isRead) {
            return false;
        }
        if (filter === 'read' && !notification.isRead) {
            return false;
        }

        return true;
    });

    // Group notifications by date
    useEffect(() => {
        if (filteredNotifications && filteredNotifications.length > 0) {
            const groups: { [key: string]: any[] } = {};

            filteredNotifications.forEach((notification: any) => {
                const date = new Date(notification.createdAt || new Date());
                const today = new Date();
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);

                let groupKey: string;

                if (date.toDateString() === today.toDateString()) {
                    groupKey = 'Hôm nay';
                } else if (date.toDateString() === yesterday.toDateString()) {
                    groupKey = 'Hôm qua';
                } else {
                    groupKey = date.toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }

                if (!groups[groupKey]) {
                    groups[groupKey] = [];
                }
                groups[groupKey].push(notification);
            });

            setGroupedNotifications(groups);
        } else {
            setGroupedNotifications({});
        }
    }, [filteredNotifications]);

    const formatTime = (timestamp: string) => {
        if (!timestamp) return "";

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
            return date.toLocaleDateString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    };

    const formatDetailedTime = (timestamp: string) => {
        if (!timestamp) return "";

        const date = new Date(timestamp);
        return date.toLocaleDateString('vi-VN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get category icon
    const getCategoryIcon = (entityType: string) => {
        switch (entityType) {
            case 'Course':
                return '📚';
            case 'Comment':
                return '💬';
            case 'Post':
                return '📝';
            case 'FriendRequest':
                return '👋';
            case 'System':
                return '🔔';
            default:
                return '📣';
        }
    };

    return (
        <div className="dark:bg-gray-900">
            <div className="container mx-auto py-6 px-4 ">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left panel - Notification list */}
                    <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                        {/* Header with search and filters */}
                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold flex items-center space-x-2 dark:text-white">
                                    <FaBell className="text-blue-500" />
                                    <span>Thông báo của bạn</span>
                                    {unreadCount > 0 && (
                                        <span className="ml-2 text-sm bg-blue-500 text-white px-2 py-0.5 rounded-full">
                                            {unreadCount} mới
                                        </span>
                                    )}
                                </h2>

                                <div className="flex gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={handleReadAll}
                                            className="flex items-center text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition"
                                        >
                                            <FaCheckDouble className="mr-1.5" />
                                            <span>Đọc tất cả</span>
                                        </button>
                                    )}

                                    <div className="relative">
                                        <button
                                            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                            className="flex items-center text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                                        >
                                            <IoFilterSharp className="mr-1.5" />
                                            <span>Lọc</span>
                                        </button>

                                        {showFilterDropdown && (
                                            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10 min-w-[180px] border border-gray-100 dark:border-gray-700">
                                                <div className="p-2">
                                                    <button
                                                        className={`w-full text-left px-3 py-2 rounded text-sm ${filter === 'all' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                                        onClick={() => {
                                                            setFilter('all');
                                                            setShowFilterDropdown(false);
                                                        }}
                                                    >
                                                        Tất cả thông báo
                                                    </button>
                                                    <button
                                                        className={`w-full text-left px-3 py-2 rounded text-sm ${filter === 'unread' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                                        onClick={() => {
                                                            setFilter('unread');
                                                            setShowFilterDropdown(false);
                                                        }}
                                                    >
                                                        Chưa đọc
                                                    </button>
                                                    <button
                                                        className={`w-full text-left px-3 py-2 rounded text-sm ${filter === 'read' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                                                        onClick={() => {
                                                            setFilter('read');
                                                            setShowFilterDropdown(false);
                                                        }}
                                                    >
                                                        Đã đọc
                                                    </button>
                                                </div>
                                                <div className="border-t border-gray-100 dark:border-gray-700 p-2">
                                                    <button
                                                        onClick={handleDeleteAllRead}
                                                        className="w-full text-left px-3 py-2 rounded text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                                    >
                                                        <FaRegTrashAlt className="inline mr-2" />
                                                        Xóa tất cả đã đọc
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm thông báo..."
                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent dark:text-white text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <FaSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                                {searchTerm && (
                                    <button
                                        className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <IoClose />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notifications list with infinite scroll */}
                        {loading && filteredNotifications.length === 0 ? (
                            <div className="flex justify-center items-center h-80">
                                <FaCircleNotch className="animate-spin text-3xl text-blue-500" />
                            </div>
                        ) : filteredNotifications.length > 0 ? (
                            <div id="scrollableDiv" className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                                <InfiniteScroll
                                    dataLength={filteredNotifications.length}
                                    next={fetchMoreData}
                                    hasMore={hasMore}
                                    loader={
                                        <div className="flex justify-center py-4">
                                            <FaCircleNotch className="animate-spin text-xl text-blue-500" />
                                        </div>
                                    }
                                    endMessage={
                                        <p className="text-center py-3 text-gray-500 text-sm">
                                            Bạn đã xem hết tất cả thông báo
                                        </p>
                                    }
                                    scrollableTarget="scrollableDiv"
                                >
                                    {Object.entries(groupedNotifications).map(([date, groupNotifications]) => (
                                        <div key={date} className="mb-2">
                                            <div className="sticky top-0 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                {date}
                                            </div>

                                            <AnimatePresence>
                                                {(groupNotifications as any[]).map((notification: any) => (
                                                    <motion.div
                                                        key={notification.id}
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className={`px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex cursor-pointer group ${selectedNotification?.id === notification.id
                                                            ? 'bg-blue-50 dark:bg-blue-900/20'
                                                            : !notification.isRead
                                                                ? 'bg-blue-50/60 dark:bg-blue-900/10'
                                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                            }`}
                                                        onClick={() => handleViewNotification(notification)}
                                                    >
                                                        <div className="flex-shrink-0 mr-3">
                                                            <div className="relative">
                                                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-lg">
                                                                    {getCategoryIcon(notification.entityType)}
                                                                </div>
                                                                {!notification.isRead && (
                                                                    <div className="absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex-1 min-w-0">
                                                            <p className={`text-sm ${!notification.isRead ? 'font-medium' : ''} dark:text-white`}>
                                                                {notification.title}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center">
                                                                <FaRegClock className="mr-1 text-xs" />
                                                                {notification.timeAgo || formatTime(notification.createdAt || '')}
                                                            </p>
                                                        </div>

                                                        <div className="ml-2 flex items-start opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button
                                                                className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1"
                                                                onClick={(e) => handleDeleteNotification(notification.id, e)}
                                                                aria-label="Delete notification"
                                                            >
                                                                <FaRegTrashAlt className="text-sm" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </InfiniteScroll>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                    {filter === 'unread' ? (
                                        <MdNotificationsActive className="text-3xl text-gray-400 dark:text-gray-300" />
                                    ) : (
                                        <MdNotificationsNone className="text-3xl text-gray-400 dark:text-gray-300" />
                                    )}
                                </div>
                                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Không có thông báo {filter === 'unread' ? 'chưa đọc' : filter === 'read' ? 'đã đọc' : ''} nào
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {searchTerm
                                        ? 'Không tìm thấy thông báo nào phù hợp với từ khóa tìm kiếm'
                                        : filter === 'unread'
                                            ? 'Bạn đã đọc tất cả thông báo của mình'
                                            : filter === 'read'
                                                ? 'Bạn chưa đọc thông báo nào hoặc đã xóa tất cả thông báo đã đọc'
                                                : 'Bạn chưa có thông báo nào. Chúng tôi sẽ thông báo cho bạn khi có cập nhật mới'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right panel - Notification detail */}
                    <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                        {selectedNotification ? (
                            <div className="h-full flex flex-col">
                                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                    <h3 className="font-medium dark:text-white">Chi tiết thông báo</h3>
                                    <div className="flex space-x-2">
                                        {!selectedNotification.isRead && (
                                            <button
                                                onClick={() => handleReadNotification(selectedNotification.id)}
                                                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                                                title="Đánh dấu đã đọc"
                                            >
                                                <FaRegCheckCircle className="text-lg" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDeleteNotification(selectedNotification.id)}
                                            className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                                            title="Xóa thông báo"
                                        >
                                            <FaRegTrashAlt className="text-lg" />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4 flex-grow overflow-y-auto">
                                    <div className="flex items-start mb-4">
                                        <div className="mr-3 mt-1">
                                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-2xl">
                                                {getCategoryIcon(selectedNotification.entityType)}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium dark:text-white">{selectedNotification.title}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                {formatDetailedTime(selectedNotification.createdAt || '')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg mt-4">
                                        <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-line">
                                            {selectedNotification.message}
                                        </p>
                                    </div>

                                    <div className="mt-6">
                                        <h5 className="text-sm font-medium mb-2 text-gray-600 dark:text-gray-400">Thông tin bổ sung</h5>
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                <div className="text-gray-500 dark:text-gray-400">Loại thông báo:</div>
                                                <div className="text-gray-700 dark:text-gray-300">
                                                    {selectedNotification.entityType || 'Thông báo hệ thống'}
                                                </div>

                                                <div className="text-gray-500 dark:text-gray-400">Trạng thái:</div>
                                                <div className="text-gray-700 dark:text-gray-300">
                                                    {selectedNotification.isRead ? 'Đã đọc' : 'Chưa đọc'}
                                                </div>

                                                {selectedNotification.entityId && (
                                                    <>
                                                        <div className="text-gray-500 dark:text-gray-400">ID liên kết:</div>
                                                        <div className="text-gray-700 dark:text-gray-300">
                                                            {selectedNotification.entityId}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition"
                                        onClick={() => navigateToContent(selectedNotification, router)}
                                    >
                                        Xem nội dung chi tiết
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                                <div className="bg-gray-50 dark:bg-gray-700 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                                    <FaBell className="text-3xl text-gray-300 dark:text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Chọn một thông báo để xem chi tiết
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                                    Chọn một thông báo từ danh sách bên trái để xem chi tiết và quản lý thông báo của bạn
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 