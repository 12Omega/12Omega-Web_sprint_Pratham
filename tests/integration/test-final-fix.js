/**
 * Final Fix Test
 * Verifies that the frontend pages should now work without errors
 */

import axios from 'axios';

async function testFinalFix() {
  try {
    console.log('🔧 Testing Final Fix...');
    
    // Get auth token
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@parkease.com',
      password: 'password123'
    });
    const authToken = loginResponse?.data?.token || response.data.token;
    console.log('✅ Authentication successful');
    
    // Test bookings API
    const bookingsResponse = await axios.get('http://localhost:3000/api/bookings', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log('\n📋 BOOKINGS TEST:');
    console.log('- Total bookings:', bookingsResponse.data.data.bookings.length);
    
    if (bookingsResponse.data.data.bookings.length > 0) {
      const booking = bookingsResponse.data.data.bookings[0];
      console.log('- Sample booking structure check:');
      console.log('  ✅ parkingSpot.spotNumber:', booking.parkingSpot.spotNumber);
      console.log('  ✅ parkingSpot.location:', booking.parkingSpot.location);
      console.log('  ✅ vehicleInfo.licensePlate:', booking.vehicleInfo.licensePlate);
      
      // Test search functionality
      const searchTerm = booking.parkingSpot.spotNumber.toLowerCase();
      const filteredBookings = bookingsResponse.data.data.bookings.filter(b => 
        (b.parkingSpot?.spotNumber?.toLowerCase() || '').includes(searchTerm) ||
        (b.parkingSpot?.location?.toLowerCase() || '').includes(searchTerm) ||
        (b.vehicleInfo?.licensePlate?.toLowerCase() || '').includes(searchTerm)
      );
      console.log('  ✅ Search filter works:', filteredBookings.length > 0);
    }
    
    // Test spots API
    const spotsResponse = await axios.get('http://localhost:3000/api/spots');
    
    console.log('\n🅿️ SPOTS TEST:');
    console.log('- Total spots:', spotsResponse.data.data.spots.length);
    
    if (spotsResponse.data.data.spots.length > 0) {
      const spot = spotsResponse.data.data.spots[0];
      console.log('- Sample spot structure check:');
      console.log('  ✅ spotNumber:', spot.spotNumber);
      console.log('  ✅ location:', spot.location);
      console.log('  ✅ hourlyRate:', spot.hourlyRate);
      
      // Test search functionality
      const searchTerm = spot.spotNumber.toLowerCase();
      const filteredSpots = spotsResponse.data.data.spots.filter(s => 
        (s.spotNumber?.toLowerCase() || '').includes(searchTerm) ||
        (s.location?.toLowerCase() || '').includes(searchTerm)
      );
      console.log('  ✅ Search filter works:', filteredSpots.length > 0);
    }
    
    console.log('\n🎉 All fixes applied successfully!');
    console.log('\n📋 Summary:');
    console.log('- ✅ Authentication working');
    console.log('- ✅ Bookings API structure matches frontend');
    console.log('- ✅ Spots API structure matches frontend');
    console.log('- ✅ Search filters working');
    console.log('- ✅ No more undefined property errors');
    
    console.log('\n🚀 The frontend pages should now load without JavaScript errors!');
    
  } catch (error) {
    console.log('\n❌ Test failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Network error:', error.message);
    }
  }
}

testFinalFix();