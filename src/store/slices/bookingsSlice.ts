/**
 * Bookings Redux Slice
 * Manages parking spot bookings state
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { bookingsAPI } from '../../services/api';
import { ParkingSpot } from './spotsSlice';
import { User } from './authSlice';

export interface Booking {
  _id: string;
  user: User | string;
  parkingSpot: ParkingSpot | string;
  startTime: string;
  endTime: string;
  duration: number;
  totalCost: number;
  status: 'active' | 'completed' | 'cancelled' | 'expired';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  vehicleInfo: {
    licensePlate: string;
    make?: string;
    model?: string;
    color?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  links?: Array<{ rel: string; href: string; method?: string }>;
}

interface BookingsState {
  bookings: Booking[];
  currentBooking: Booking | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBookings: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

const initialState: BookingsState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  },
};

// Async Thunks
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (params: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.getBookings(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.getBookingById(bookingId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking');
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData: {
    parkingSpot: string;
    startTime: string;
    endTime: string;
    vehicleInfo: {
      licensePlate: string;
      make?: string;
      model?: string;
      color?: string;
    };
    notes?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.createBooking(bookingData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
    }
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ bookingId, bookingData }: {
    bookingId: string;
    bookingData: {
      startTime?: string;
      endTime?: string;
      vehicleInfo?: Partial<Booking['vehicleInfo']>;
      notes?: string;
    };
  }, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.updateBooking(bookingId, bookingData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update booking');
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.cancelBooking(bookingId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
);

export const completeBooking = createAsyncThunk(
  'bookings/completeBooking',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      const response = await bookingsAPI.completeBooking(bookingId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to complete booking');
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (bookingId: string, { rejectWithValue }) => {
    try {
      await bookingsAPI.deleteBooking(bookingId);
      return bookingId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete booking');
    }
  }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Bookings
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload.bookings;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Booking by ID
    builder
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload.booking;
        state.error = null;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.unshift(action.payload.booking);
        state.currentBooking = action.payload.booking;
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Booking
    builder
      .addCase(updateBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(booking => booking._id === action.payload.booking._id);
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
        if (state.currentBooking?._id === action.payload.booking._id) {
          state.currentBooking = action.payload.booking;
        }
        state.error = null;
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Cancel Booking
    builder
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(booking => booking._id === action.payload.booking._id);
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
        if (state.currentBooking?._id === action.payload.booking._id) {
          state.currentBooking = action.payload.booking;
        }
        state.error = null;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Complete Booking
    builder
      .addCase(completeBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeBooking.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(booking => booking._id === action.payload.booking._id);
        if (index !== -1) {
          state.bookings[index] = action.payload.booking;
        }
        if (state.currentBooking?._id === action.payload.booking._id) {
          state.currentBooking = action.payload.booking;
        }
        state.error = null;
      })
      .addCase(completeBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Booking
    builder
      .addCase(deleteBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = state.bookings.filter(booking => booking._id !== action.payload);
        if (state.currentBooking?._id === action.payload) {
          state.currentBooking = null;
        }
        state.error = null;
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentBooking } = bookingsSlice.actions;
export default bookingsSlice.reducer;