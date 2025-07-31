/**
 * Parking Spot Model - MongoDB Schema for parking spots
 */

import mongoose, { Document, Schema } from 'mongoose';

export interface IParkingSpot extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const parkingSpotSchema = new Schema<IParkingSpot>({
  spotNumber: {
    type: String,
    required: [true, 'Spot number is required'],
    trim: true,
    uppercase: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [3, 'Location must be at least 3 characters']
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  coordinates: {
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  type: {
    type: String,
    enum: ['standard', 'compact', 'handicap', 'electric'],
    default: 'standard',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'reserved', 'maintenance'],
    default: 'available',
    required: true
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: [0, 'Hourly rate cannot be negative']
  },
  features: [{
    type: String,
    trim: true
  }],
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for performance and geospatial queries
parkingSpotSchema.index({ spotNumber: 1 }, { unique: true });
parkingSpotSchema.index({ status: 1 });
parkingSpotSchema.index({ type: 1 });
parkingSpotSchema.index({ location: 1 });
parkingSpotSchema.index({ 'coordinates.latitude': 1, 'coordinates.longitude': 1 });
parkingSpotSchema.index({ hourlyRate: 1 });

// Geospatial index for location-based queries
parkingSpotSchema.index({ coordinates: '2dsphere' });

export default mongoose.models.ParkingSpot || mongoose.model<IParkingSpot>('ParkingSpot', parkingSpotSchema);