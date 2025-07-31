/**
 * Test API Endpoints
 * Tests spots and bookings endpoints to identify issues
 */

import axios from 'axios';

async function testAPIEndpoints() {
  try {
    console.log('🧪 Testing API Endpoints...');
    
    // Test 1: Test spots endpoint (should be public)
    console.log('\n1. Testing spots endpoint (public)...');
    try {
      const spotsResponse = await axios.get('http://localhost:5002/api/spots');
      console.log('✅ Spots endpoint working!');
      console.log('Total spots:', spotsResponse.data.data?.spots?.length || spotsResponse.data.length || 'Unknown');
      console.log('Response structure:', Object.keys(spotsResponse.data));
    } catch (spotsError) {
      console.log('❌ Spots endpoint failed:');
      console.log('Status:', spotsError.response?.status);
      console.log('Error:', spotsError.response?.data);
    }
    
    // Test 2: Test bookings endpoint without auth (should fail)
    console.log('\n2. Testing bookings endpoint without auth (should fail)...');
    try {
      const bookingsResponse = await axios.get('http://localhost:5002/api/bookings');
      console.log('❌ Bookings endpoint should have failed without auth!');
      console.log('Response:', bookingsResponse.data);
    } catch (bookingsError) {
      if (bookingsError.response?.status === 401) {
        console.log('✅ Bookings endpoint correctly requires authentication');
      } else {
        console.log('❌ Unexpected error for bookings without auth:');
        console.log('Status:', bookingsError.response?.status);
        console.log('Error:', bookingsError.response?.data);
      }
    }
    
    // Test 3: Login and get token
    console.log('\n3. Testing login to get auth token...');
    let authToken = null;
    try {
      const loginResponse = await axios.post('http://localhost:5002/api/auth/login', {
        email: 'admin@parkease.com',
        password: 'password123'
      });
      authToken = loginResponse.data.data.token;
      console.log('✅ Login successful, token obtained');
    } catch (loginError) {
      console.log('❌ Login failed:');
      console.log('Status:', loginError.response?.status);
      console.log('Error:', loginError.response?.data);
      return; // Can't continue without token
    }
    
    // Test 4: Test bookings endpoint with auth
    console.log('\n4. Testing bookings endpoint with auth...');
    try {
      const authBookingsResponse = await axios.get('http://localhost:5002/api/bookings', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      console.log('✅ Authenticated bookings endpoint working!');
      console.log('Total bookings:', authBookingsResponse.data.data?.bookings?.length || authBookingsResponse.data.length || 'Unknown');
      console.log('Response structure:', Object.keys(authBookingsResponse.data));
    } catch (authBookingsError) {
      console.log('❌ Authenticated bookings endpoint failed:');
      console.log('Status:', authBookingsError.response?.status);
      console.log('Error:', authBookingsError.response?.data);
    }
    
    // Test 5: Test health endpoint
    console.log('\n5. Testing health endpoint...');
    try {
      const healthResponse = await axios.get('http://localhost:5002/api/health');
      console.log('✅ Health endpoint working!');
      console.log('Status:', healthResponse.data.status);
      console.log('Available endpoints:', healthResponse.data.links?.map(link => link.rel).join(', '));
    } catch (healthError) {
      console.log('❌ Health endpoint failed:');
      console.log('Status:', healthError.response?.status);
      console.log('Error:', healthError.response?.data);
    }
    
    console.log('\n📋 Test Summary Complete');
    
  } catch (error) {
    console.log('\n❌ Test failed:');
    console.log('Error:', error.message);
  }
}

testAPIEndpoints();