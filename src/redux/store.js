import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import profileReducer from './profileSlice'; // Adjust the path to where your authSlice is located
import videoReducer from './videoSlice';
import categoriesReducer from './categorySlice';
import uiReducer from './uiSlice';
import notificationReducer from './notificationSlice';
// Configure the Redux store
const store = configureStore({
    reducer: {
        auth: authReducer, 
        profile: profileReducer,
        videos: videoReducer,
        categories: categoriesReducer,
        ui: uiReducer,
        notifications: notificationReducer, 
    },
});

export default store;
