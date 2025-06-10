"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/redux/hook/hook";
import { markAsReadThunk } from "@/redux/reducers/slices/NotificationSlice";
import { motion } from "@/lib/motion";
import { timeAgo } from "@/Utils/functions";
import { FaCircleCheck } from "react-icons/fa6";
import { toast } from "react-hot-toast";

const NotificationsPopup = ({ onClose }: { onClose: () => void }) => {
    const { notifications, unreadCount } = useAppSelector((state) => state.noti);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleViewAll = () => {
        router.push("/notifications");
        onClose();
    };

    const handleClickNotification = async (notification: any) => {
        try {
            // If notification is unread, mark it as read
            if (!notification.isRead) {
                await dispatch(markAsReadThunk(notification.id)).unwrap();
            }

            // Handle navigation based on notification type
            if (notification.entityType === 'Course' && notification.entityId) {
                router.push(`/learning/${notification.entityId}`);
            } else if (notification.entityType === 'Post' && notification.entityId) {
                router.push(`/post/${notification.entityId}`);
            } else if (notification.entityType === 'Comment' && notification.entityId) {
                router.push(`/learning/${notification.entityId}?comment=${notification.dataId}`);
            } else {
                // Default to notifications page
                router.push("/notifications");
            }

            onClose();
        } catch (error) {
            toast.error("Không thể đánh dấu đã đọc");
        }
    };

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
            return date.toLocaleDateString('vi-VN');
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-[300px] sm:w-[350px] max-h-[450px] overflow-hidden flex flex-col"
        >
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold dark:text-white">
                    Thông báo {unreadCount > 0 && <span className="text-xs text-blue-500">({unreadCount} mới)</span>}
                </h3>
                <button
                    onClick={handleViewAll}
                    className="text-blue-500 hover:text-blue-700 text-xs sm:text-sm"
                >
                    Xem tất cả
                </button>
            </div>

            <div className="overflow-y-auto flex-grow">
                {notifications && notifications.length > 0 ? (
                    <div>
                        {notifications.slice(0, 5).map((notification: any) => (
                            <motion.div
                                key={notification.id}
                                whileHover={{ backgroundColor: "#f7f9fa" }}
                                onClick={() => handleClickNotification(notification)}
                                className={`p-3 sm:p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer flex items-start ${!notification.isRead ? "bg-blue-50 dark:bg-blue-900/20" : ""
                                    }`}
                            >
                                <img
                                    src={notification.extraData?.avatar || "/images/logo.png"}
                                    alt="Avatar"
                                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover mr-2 sm:mr-3"
                                />
                                <div className="flex-1">
                                    <p className="text-xs sm:text-sm font-medium mr-1 truncate max-w-[230px] dark:text-white">
                                        {notification.title}
                                    </p>
                                    <p className="text-xs sm:text-sm mb-1 line-clamp-2 dark:text-gray-300">
                                        {notification.message}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                                        {notification.timeAgo || formatTime(notification.createdAt)}
                                    </p>
                                </div>
                                {!notification.isRead && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 sm:p-8 text-center text-gray-500 dark:text-gray-400">
                        <p className="text-sm">Không có thông báo mới</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default NotificationsPopup;
