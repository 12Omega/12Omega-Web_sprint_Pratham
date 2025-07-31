/**
 * Debug API Structure
 * Detailed inspection of API response structure
 */

import axios from 'axios';

async function debugAPIStructure() {
  try {
    console.log('🔍 Debugging API Structure...');
    
    // Get auth token
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@parkease.com',
      password: 'password123'
    });
    const authToken = loginResponse.data.data.token;
    
    // Test bookings structure
    console.log('\n📋 BOOKINGS API STRUCTURE:');
    const bookingsResponse = await axios.get('http://localhost:3000/api/bookings', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log('Full response structure:');
    console.log(JSON.stringify(bookingsResponse.data, null, 2));
    
    if (bookingsResponse.data.data?.bookings?.length > 0) {
      console.log('\n📋 SAMPLE BOOKING OBJECT:');
      const sampleBooking = bookingsResponse.data.data.bookings[0];
      console.log(JSON.stringify(sampleBooking, null, 2));
      
      console.log('\n📋 BOOKING FIELD ANALYSIS:');
      console.log('- parkingSpot exists:', !!sampleBooking.parkingSpot);
      console.log('- parkingSpot.name exists:', !!sampleBooking.parkingSpot?.name);
      console.log('- parkingSpot keys:', Object.keys(sampleBooking.parkingSpot || {}));
      console.log('- vehicleInfo exists:', !!sampleBooking.vehicleInfo);
      console.log('- vehicleInfo.licensePlate exists:', !!sampleBooking.vehicleInfo?.licensePlate);
      console.log('- vehicleInfo keys:', Object.keys(sampleBooking.vehicleInfo || {}));
    }
    
    // Test spots structure
    console.log('\n🅿️ SPOTS API STRUCTURE:');
    const spotsResponse = await axios.get('http://localhost:3000/api/spots');
    
    if (spotsResponse.data.data?.spots?.length > 0) {
      console.log('\n🅿️ SAMPLE SPOT OBJECT:');
      const sampleSpot = spotsResponse.data.data.spots[0];
      console.log(JSON.stringify(sampleSpot, null, 2));
      
      console.log('\n🅿️ SPOT FIELD ANALYSIS:');
      console.log('- name exists:', !!sampleSpot.name);
      console.log('- location exists:', !!sampleSpot.location);
      console.log('- spotNumber exists:', !!sampleSpot.spotNumber);
      console.log('- All keys:', Object.keys(sampleSpot));
    }
    
  } catch (error) {
    console.log('\n❌ Debug failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Network error:', error.message);
    }
  }
}

debugAPIStructure();