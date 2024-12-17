import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarExpanded: false,
  notificationMenuOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarExpanded = !state.sidebarExpanded;
    },
    toggleNotificationMenu(state) {
      state.notificationMenuOpen = !state.notificationMenuOpen;
    },
  },
});

export const { toggleSidebar, toggleNotificationMenu } = uiSlice.actions;

export default uiSlice.reducer;
