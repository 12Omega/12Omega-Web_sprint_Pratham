/**
 * UI Redux Slice
 * Manages global UI state and preferences
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  loading: {
    global: boolean;
    spots: boolean;
    bookings: boolean;
    auth: boolean;
  };
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    timestamp: number;
    read: boolean;
  }>;
  modals: {
    bookingModal: boolean;
    spotModal: boolean;
    confirmModal: boolean;
  };
  preferences: {
    mapView: 'satellite' | 'roadmap' | 'hybrid';
    autoRefresh: boolean;
    refreshInterval: number; // in seconds
    notifications: boolean;
    soundEnabled: boolean;
  };
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: (localStorage.getItem('theme') as 'light' | 'dark') || 'light',
  loading: {
    global: false,
    spots: false,
    bookings: false,
    auth: false,
  },
  notifications: [],
  modals: {
    bookingModal: false,
    spotModal: false,
    confirmModal: false,
  },
  preferences: {
    mapView: (localStorage.getItem('mapView') as 'satellite' | 'roadmap' | 'hybrid') || 'roadmap',
    autoRefresh: JSON.parse(localStorage.getItem('autoRefresh') || 'true'),
    refreshInterval: parseInt(localStorage.getItem('refreshInterval') || '30'),
    notifications: JSON.parse(localStorage.getItem('notifications') || 'true'),
    soundEnabled: JSON.parse(localStorage.getItem('soundEnabled') || 'true'),
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    setLoading: (state, action: PayloadAction<{ key: keyof UIState['loading']; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    addNotification: (state, action: PayloadAction<{
      type: 'success' | 'error' | 'warning' | 'info';
      title: string;
      message: string;
    }>) => {
      const notification = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: Date.now(),
        read: false,
      };
      state.notifications.unshift(notification);
      
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications = state.notifications.slice(0, 50);
      }
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setModal: (state, action: PayloadAction<{ modal: keyof UIState['modals']; open: boolean }>) => {
      state.modals[action.payload.modal] = action.payload.open;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UIState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
      
      // Save to localStorage
      Object.entries(action.payload).forEach(([key, value]) => {
        localStorage.setItem(key, JSON.stringify(value));
      });
    },
    resetUI: (state) => {
      state.sidebarOpen = true;
      state.loading = {
        global: false,
        spots: false,
        bookings: false,
        auth: false,
      };
      state.notifications = [];
      state.modals = {
        bookingModal: false,
        spotModal: false,
        confirmModal: false,
      };
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLoading,
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearNotifications,
  setModal,
  updatePreferences,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;