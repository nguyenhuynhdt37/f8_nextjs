'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the notification type
export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    image: string;
}

// Define the context type
interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
}

// Create the context with a default value
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Mock data for demonstration
const INITIAL_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'course_update',
        title: 'Khóa học HTML CSS Pro',
        message: 'Bài học mới "Làm dự án thực tế" đã được cập nhật',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        read: false,
        image: '/images/logo.png'
    },
    {
        id: '2',
        type: 'comment_reply',
        title: 'Nguyễn Văn A',
        message: 'đã trả lời bình luận của bạn: "Cảm ơn bạn về lời khuyên..."',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        read: true,
        image: '/images/avatar-empty.png'
    },
    {
        id: '3',
        type: 'new_blog',
        title: 'Bài viết mới',
        message: '"10 mẹo tăng hiệu suất làm việc với JavaScript" đã được xuất bản',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        image: '/images/logo.png'
    }
];

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Initialize notifications from localStorage or API
    useEffect(() => {
        const fetchNotifications = async () => {
            // In a real app, this would be an API call
            // For now, we'll use our mock data
            setNotifications(INITIAL_NOTIFICATIONS);
        };

        fetchNotifications();
    }, []);

    // Update unread count whenever notifications change
    useEffect(() => {
        const count = notifications.filter(notification => !notification.read).length;
        setUnreadCount(count);
    }, [notifications]);

    // Mark a single notification as read
    const markAsRead = (id: string) => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
        // In a real app, make an API call to update the read status
    };

    // Mark all notifications as read
    const markAllAsRead = () => {
        setNotifications(prevNotifications =>
            prevNotifications.map(notification => ({ ...notification, read: true }))
        );
        // In a real app, make an API call to update all read statuses
    };

    // Remove a notification
    const removeNotification = (id: string) => {
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.id !== id)
        );
        // In a real app, make an API call to delete the notification
    };

    // Add a new notification
    const addNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Math.random().toString(36).substring(2, 9), // Generate a random ID
            timestamp: new Date().toISOString(),
        };

        setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
        // In a real app, this might be handled by a server via WebSockets
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                unreadCount,
                markAsRead,
                markAllAsRead,
                removeNotification,
                addNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
};

// Custom hook to use the notification context
export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
