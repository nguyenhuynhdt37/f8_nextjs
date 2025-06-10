import { getInfoUser } from '@/api/axios/api';
import { GetUserInfoByToken, login } from '@/api/axios/api';
import {
    getNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotificationById
} from '@/api/axios/api';
import { IAuthSlice } from '@/types/next-auth';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { number } from 'framer-motion';

interface Notification {
    id: number;
    userId: number | null;
    title: string;
    message: string;
    entityType: string | null;
    entityId: string | null;
    dataId?: number | null;
    isRead: boolean;
    createdAt: string | null;
    timeAgo?: string;
    extraData?: any;
}

interface NotificationState {
    notifications: Notification[];
    currentPage: number;
    totalPages: number;
    totalCount: number;
    unreadCount: number;
    hasMore: boolean;
    loading: boolean;
    error: any;
}

const initialState: NotificationState = {
    notifications: [],
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    unreadCount: 0,
    hasMore: true,
    loading: false,
    error: null
};

// Async thunks
export const fetchNotifications = createAsyncThunk(
    'notification/fetchNotifications',
    async ({ page, pageSize }: { page: number; pageSize: number }, thunkAPI) => {
        try {
            const response = await getNotifications(page, pageSize);
            if (response?.statusCode === 200) {
                return response.data;
            } else {
                return thunkAPI.rejectWithValue(response);
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const fetchUnreadCount = createAsyncThunk(
    'notification/fetchUnreadCount',
    async (_, thunkAPI) => {
        try {
            const response = await getUnreadNotificationCount();
            if (response?.statusCode === 200) {
                return response.data;
            } else {
                return thunkAPI.rejectWithValue(response);
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const markAsReadThunk = createAsyncThunk(
    'notification/markAsRead',
    async (notificationId: number, thunkAPI) => {
        try {
            const response = await markNotificationAsRead(notificationId);
            if (response?.statusCode === 200) {
                return { notificationId };
            } else {
                return thunkAPI.rejectWithValue(response);
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const markAllAsReadThunk = createAsyncThunk(
    'notification/markAllAsRead',
    async (_, thunkAPI) => {
        try {
            const response = await markAllNotificationsAsRead();
            if (response?.statusCode === 200) {
                return response.data;
            } else {
                return thunkAPI.rejectWithValue(response);
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

export const deleteNotificationThunk = createAsyncThunk(
    'notification/deleteNotification',
    async (notificationId: number, thunkAPI) => {
        try {
            const response = await deleteNotificationById(notificationId);
            if (response?.statusCode === 200) {
                return { notificationId };
            } else {
                return thunkAPI.rejectWithValue(response);
            }
        } catch (error) {
            return thunkAPI.rejectWithValue(error);
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications = [action.payload, ...state.notifications];
            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        },
        resetNotificationState: (state) => {
            return initialState;
        },
        setNotifications: (state, action: PayloadAction<any[]>) => {
            // This is a helper action to initialize notifications from mock data
            state.notifications = action.payload.map(notification => ({
                id: parseInt(notification.id),
                userId: 1,
                title: notification.title,
                message: notification.message,
                entityType: notification.type,
                entityId: notification.id,
                isRead: notification.read,
                createdAt: notification.timestamp,
                extraData: { avatar: notification.image }
            }));
        },
    },
    extraReducers: builder => {
        builder
            // Fetch notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;

                // If it's the first page, replace the notifications array
                if (action.payload.currentPage === 1) {
                    state.notifications = action.payload.notifications;
                } else {
                    // Otherwise append to the existing array
                    state.notifications = [...state.notifications, ...action.payload.notifications];
                }

                state.currentPage = action.payload.currentPage;
                state.totalPages = action.payload.totalPages;
                state.totalCount = action.payload.totalCount;
                state.unreadCount = action.payload.unreadCount;
                state.hasMore = action.payload.currentPage < action.payload.totalPages;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch unread count
            .addCase(fetchUnreadCount.fulfilled, (state, action: PayloadAction<any>) => {
                state.unreadCount = action.payload;
            })

            // Mark as read
            .addCase(markAsReadThunk.fulfilled, (state, action: PayloadAction<any>) => {
                const { notificationId } = action.payload;
                const notification = state.notifications.find(n => n.id === notificationId);
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })

            // Mark all as read
            .addCase(markAllAsReadThunk.fulfilled, (state) => {
                state.notifications = state.notifications.map(notification => ({ ...notification, isRead: true }));
                state.unreadCount = 0;
            })

            // Delete notification
            .addCase(deleteNotificationThunk.fulfilled, (state, action: PayloadAction<any>) => {
                const { notificationId } = action.payload;
                const notificationToDelete = state.notifications.find(n => n.id === notificationId);
                if (notificationToDelete && !notificationToDelete.isRead) {
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
                state.notifications = state.notifications.filter(notification => notification.id !== notificationId);
                state.totalCount = Math.max(0, state.totalCount - 1);
            })
    },
});

export const { addNotification, resetNotificationState, setNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
