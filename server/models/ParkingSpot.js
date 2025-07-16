const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParkingSpotSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model('ParkingSpot', ParkingSpotSchema);
