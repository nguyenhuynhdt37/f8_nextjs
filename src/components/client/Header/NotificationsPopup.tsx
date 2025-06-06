"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hook/hook";
import { motion } from "@/lib/motion";
import { timeAgo } from "@/Utils/functions";
import { FaCircleCheck } from "react-icons/fa6";

const NotificationsPopup = ({ onClose }: { onClose: () => void }) => {
    const notifications = useAppSelector((state) => state.noti.notifications);
    const router = useRouter();

    const handleViewAll = () => {
        router.push("/notifications");
        onClose();
    };

    const handleClickNotification = (id: string) => {
        router.push(`/notifications?id=${id}`);
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-[300px] sm:w-[350px] max-h-[450px] overflow-hidden flex flex-col"
        >
            <div className="flex justify-between items-center border-b border-gray-200 p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold">Thông báo</h3>
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
                                onClick={() => handleClickNotification(notification.id)}
                                className={`p-3 sm:p-4 border-b border-gray-100 cursor-pointer flex items-start ${!notification.isRead ? "bg-blue-50" : ""
                                    }`}
                            >
                                <img
                                    src={notification.sender?.avatar || "/images/avatar-empty.png"}
                                    alt="Avatar"
                                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full object-cover mr-2 sm:mr-3"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center mb-1">
                                        <p className="text-xs sm:text-sm font-medium mr-1 truncate max-w-[120px] sm:max-w-[150px]">
                                            {notification.sender?.name || "F8 Education"}
                                        </p>
                                        {notification.sender?.roleId === 2 && (
                                            <FaCircleCheck className="text-[#46a8ff] text-xs sm:text-sm" />
                                        )}
                                    </div>
                                    <p
                                        className="text-xs sm:text-sm mb-1 line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: notification.message }}
                                    ></p>
                                    <p className="text-[10px] sm:text-xs text-gray-500">
                                        {timeAgo(notification.createdAt)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="p-6 sm:p-8 text-center text-gray-500">
                        <p className="text-sm">Không có thông báo mới</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default NotificationsPopup;
