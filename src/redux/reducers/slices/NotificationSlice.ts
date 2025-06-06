import { getInfoUser } from '@/api/axios/api';
import { GetUserInfoByToken, login } from '@/api/axios/api';
import { IAuthSlice } from '@/types/next-auth';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { number } from 'framer-motion';


export const getInfoRedux = createAsyncThunk(
    'auth/getinfo',
    async (_, thunkAPI) => {
        const res = await getInfoUser();

        if (res?.statusCode === 200) {
            return res?.data;
        } else {
            return thunkAPI.rejectWithValue(res);
        }
    },
);
interface Notification {
    userId: number | null;
    title: string;
    message: string;
    entityType: string | null;
    entityId: string | null;
    isRead: boolean;
    createdAt: string | null;
    extraData: any;
}

interface NotificationState {
    notifications: Notification[];
    loading: boolean;
    error: any;
}
const initialState: NotificationState = {
    notifications: [],
    loading: false,
    error: null
};


const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications = [action.payload, ...state.notifications];
        },
        markAsRead: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.map(notification =>
                notification.entityId === action.payload ? { ...notification, isRead: true } : notification
            );
        },
        markAllAsRead: (state) => {
            state.notifications = state.notifications.map(notification => ({ ...notification, isRead: true }));
        },
        deleteNotification: (state, action: PayloadAction<string>) => {
            state.notifications = state.notifications.filter(notification => notification.entityId !== action.payload);
        },
        setNotifications: (state, action: PayloadAction<any[]>) => {
            // This is a helper action to initialize notifications from mock data
            state.notifications = action.payload.map(notification => ({
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
    // extraReducers: builder => {
    //     builder
    //         .addCase(getInfoRedux.pending, state => {
    //             state.loading = true;
    //             state.error = null;
    //         })
    //         .addCase(getInfoRedux.fulfilled, (state, action: PayloadAction<any>) => {
    //             state.loading = false;
    //             state.user = action.payload;
    //         })
    //         .addCase(getInfoRedux.rejected, (state, action: PayloadAction<any>) => {
    //             state.loading = false;
    //             state.error = action.payload;
    //         });
    // },
});

export const { addNotification, markAsRead, markAllAsRead, deleteNotification, setNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;
