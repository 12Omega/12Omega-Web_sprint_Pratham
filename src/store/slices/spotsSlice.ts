/**
 * Parking Spots Redux Slice
 * Manages parking spots state and operations
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { spotsAPI } from '../../services/api';

export interface ParkingSpot {
  _id: string;
  spotNumber: string;
  location: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: 'standard' | 'compact' | 'handicap' | 'electric';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  hourlyRate: number;
  features: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
  links?: Array<{ rel: string; href: string; method?: string }>;
}

interface SpotsState {
  spots: ParkingSpot[];
  currentSpot: ParkingSpot | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalSpots: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
  filters: {
    type?: string;
    status?: string;
    location?: string;
    minRate?: number;
    maxRate?: number;
  };
}

const initialState: SpotsState = {
  spots: [],
  currentSpot: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalSpots: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 10,
  },
  filters: {},
};

// Async Thunks
export const fetchSpots = createAsyncThunk(
  'spots/fetchSpots',
  async (params: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    location?: string;
    minRate?: number;
    maxRate?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}, { rejectWithValue }) => {
    try {
      const response = await spotsAPI.getSpots(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch spots');
    }
  }
);

export const fetchSpotById = createAsyncThunk(
  'spots/fetchSpotById',
  async (spotId: string, { rejectWithValue }) => {
    try {
      const response = await spotsAPI.getSpotById(spotId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch spot');
    }
  }
);

export const createSpot = createAsyncThunk(
  'spots/createSpot',
  async (spotData: Omit<ParkingSpot, '_id' | 'createdAt' | 'updatedAt' | 'links'>, { rejectWithValue }) => {
    try {
      const response = await spotsAPI.createSpot(spotData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create spot');
    }
  }
);

export const updateSpot = createAsyncThunk(
  'spots/updateSpot',
  async ({ spotId, spotData }: {
    spotId: string;
    spotData: Partial<Omit<ParkingSpot, '_id' | 'createdAt' | 'updatedAt' | 'links'>>;
  }, { rejectWithValue }) => {
    try {
      const response = await spotsAPI.updateSpot(spotId, spotData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update spot');
    }
  }
);

export const updateSpotStatus = createAsyncThunk(
  'spots/updateSpotStatus',
  async ({ spotId, status }: { spotId: string; status: string }, { rejectWithValue }) => {
    try {
      const response = await spotsAPI.updateSpotStatus(spotId, status);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update spot status');
    }
  }
);

export const deleteSpot = createAsyncThunk(
  'spots/deleteSpot',
  async (spotId: string, { rejectWithValue }) => {
    try {
      await spotsAPI.deleteSpot(spotId);
      return spotId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete spot');
    }
  }
);

export const fetchNearbySpots = createAsyncThunk(
  'spots/fetchNearbySpots',
  async ({ lat, lng, radius, limit }: {
    lat: number;
    lng: number;
    radius?: number;
    limit?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await spotsAPI.getNearbySpots(lat, lng, radius, limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch nearby spots');
    }
  }
);

const spotsSlice = createSlice({
  name: 'spots',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action: PayloadAction<Partial<SpotsState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setCurrentSpot: (state, action: PayloadAction<ParkingSpot | null>) => {
      state.currentSpot = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch Spots
    builder
      .addCase(fetchSpots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpots.fulfilled, (state, action) => {
        state.loading = false;
        state.spots = action.payload.spots;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchSpots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Spot by ID
    builder
      .addCase(fetchSpotById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpotById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSpot = action.payload.spot;
        state.error = null;
      })
      .addCase(fetchSpotById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create Spot
    builder
      .addCase(createSpot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSpot.fulfilled, (state, action) => {
        state.loading = false;
        state.spots.unshift(action.payload.spot);
        state.error = null;
      })
      .addCase(createSpot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Spot
    builder
      .addCase(updateSpot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSpot.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.spots.findIndex(spot => spot._id === action.payload.spot._id);
        if (index !== -1) {
          state.spots[index] = action.payload.spot;
        }
        if (state.currentSpot?._id === action.payload.spot._id) {
          state.currentSpot = action.payload.spot;
        }
        state.error = null;
      })
      .addCase(updateSpot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update Spot Status
    builder
      .addCase(updateSpotStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSpotStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.spots.findIndex(spot => spot._id === action.payload.spot._id);
        if (index !== -1) {
          state.spots[index] = action.payload.spot;
        }
        if (state.currentSpot?._id === action.payload.spot._id) {
          state.currentSpot = action.payload.spot;
        }
        state.error = null;
      })
      .addCase(updateSpotStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete Spot
    builder
      .addCase(deleteSpot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSpot.fulfilled, (state, action) => {
        state.loading = false;
        state.spots = state.spots.filter(spot => spot._id !== action.payload);
        if (state.currentSpot?._id === action.payload) {
          state.currentSpot = null;
        }
        state.error = null;
      })
      .addCase(deleteSpot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch Nearby Spots
    builder
      .addCase(fetchNearbySpots.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbySpots.fulfilled, (state, action) => {
        state.loading = false;
        state.spots = action.payload.spots;
        state.error = null;
      })
      .addCase(fetchNearbySpots.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setFilters, clearFilters, setCurrentSpot } = spotsSlice.actions;
export default spotsSlice.reducer;