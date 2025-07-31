/**
 * Redux Store Configuration
 * Centralized state management for ParkEase Web
 */

import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import spotsSlice from './slices/spotsSlice';
import bookingsSlice from './slices/bookingsSlice';
import uiSlice from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    spots: spotsSlice,
    bookings: bookingsSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;