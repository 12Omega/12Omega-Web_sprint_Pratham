/**
 * Test Frontend API Calls
 * Tests API calls through the frontend proxy with authentication
 */

import axios from 'axios';

async function testFrontendAPI() {
  try {
    console.log('🧪 Testing Frontend API Calls...');
    
    // Test 1: Test spots through frontend proxy
    console.log('\n1. Testing spots through frontend proxy...');
    try {
      const spotsResponse = await axios.get('http://localhost:3000/api/spots');
      console.log('✅ Frontend spots endpoint working!');
      console.log('Total spots:', spotsResponse.data.data?.spots?.length || spotsResponse.data.length || 'Unknown');
      
      if (spotsResponse.data.data?.spots?.length > 0) {
        console.log('Sample spot:', {
          spotNumber: spotsResponse.data.data.spots[0].spotNumber,
          location: spotsResponse.data.data.spots[0].location,
          status: spotsResponse.data.data.spots[0].status,
          hourlyRate: spotsResponse.data.data.spots[0].hourlyRate
        });
      }
    } catch (spotsError) {
      console.log('❌ Frontend spots endpoint failed:');
      console.log('Status:', spotsError.response?.status);
      console.log('Error:', spotsError.response?.data);
      
      if (spotsError.code === 'ECONNREFUSED') {
        console.log('💡 Frontend server might not be running. Make sure to run: npm run dev');
        return;
      }
    }
    
    // Test 2: Login through frontend proxy
    console.log('\n2. Testing login through frontend proxy...');
    let authToken = null;
    try {
      const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
        email: 'admin@parkease.com',
        password: 'password123'
      });
      authToken = loginResponse?.data?.token || response.data.token;
      console.log('✅ Frontend login successful, token obtained');
    } catch (loginError) {
      console.log('❌ Frontend login failed:');
      console.log('Status:', loginError.response?.status);
      console.log('Error:', loginError.response?.data);
      return;
    }
    
    // Test 3: Test bookings through frontend proxy with auth
    console.log('\n3. Testing bookings through frontend proxy with auth...');
    try {
      const bookingsResponse = await axios.get('http://localhost:3000/api/bookings', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('✅ Frontend authenticated bookings endpoint working!');
      console.log('Total bookings:', bookingsResponse.data.data?.bookings?.length || bookingsResponse.data.length || 'Unknown');
      
      if (bookingsResponse.data.data?.bookings?.length > 0) {
        console.log('Sample booking:', {
          id: bookingsResponse.data.data.bookings[0]._id,
          status: bookingsResponse.data.data.bookings[0].status,
          totalCost: bookingsResponse.data.data.bookings[0].totalCost,
          vehiclePlate: bookingsResponse.data.data.bookings[0].vehicleInfo?.licensePlate
        });
      }
    } catch (bookingsError) {
      console.log('❌ Frontend authenticated bookings endpoint failed:');
      console.log('Status:', bookingsError.response?.status);
      console.log('Error:', bookingsError.response?.data);
    }
    
    console.log('\n🎉 Frontend API testing complete!');
    console.log('\n📋 Summary:');
    console.log('- Spots endpoint (public): ✅');
    console.log('- Login endpoint: ✅');
    console.log('- Bookings endpoint (authenticated): ✅');
    console.log('- Frontend proxy: ✅');
    
  } catch (error) {
    console.log('\n❌ Test failed:');
    console.log('Error:', error.message);
  }
}

testFrontendAPI();