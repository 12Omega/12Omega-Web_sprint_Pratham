const mongoose = require('mongoose');

const parkingSpotSchema = new mongoose.Schema({
  spotNumber: {
    type: String,
    required: [true, 'Spot number is required'],
    trim: true,
    uppercase: true,
    unique: true
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

// Indexes for performance
parkingSpotSchema.index({ spotNumber: 1 }, { unique: true });
parkingSpotSchema.index({ status: 1 });
parkingSpotSchema.index({ type: 1 });
parkingSpotSchema.index({ location: 1 });
parkingSpotSchema.index({ hourlyRate: 1 });

module.exports = mongoose.model('ParkingSpot', parkingSpotSchema);