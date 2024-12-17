import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for your API
const API_URL = 'http://localhost:4000/api/notifications';

// Fetch notifications for the current user
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { getState, rejectWithValue }) => {
        const { auth } = getState(); // Access state using getState
        const token = auth.token; // Replace with your actual auth token logic
        try {
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Mark a notification as read
export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId, { getState, rejectWithValue }) => {
        const { auth } = getState(); // Access state using getState
        const token = auth.token; // Replace with your actual auth token logic
        try {
            const response = await axios.patch(
                `${API_URL}/${notificationId}/read`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Slice
const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        notifications: [],
        loading: false,
        error: null,
    },
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(
                    (notif) => notif._id === action.payload._id
                );
                if (index !== -1) state.notifications[index].isRead = true;
            });
    },
});

export const { addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;

