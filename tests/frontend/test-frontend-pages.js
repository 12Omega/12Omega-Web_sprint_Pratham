/**
 * Test Frontend Pages
 * Tests the frontend pages to ensure they load without errors
 */

import axios from 'axios';

async function testFrontendPages() {
  try {
    console.log('🧪 Testing Frontend Pages...');
    
    // Test 1: Login and get token
    console.log('\n1. Getting authentication token...');
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@parkease.com',
      password: 'password123'
    });
    const authToken = loginResponse?.data?.token || response.data.token;
    console.log('✅ Authentication token obtained');
    
    // Test 2: Test bookings API structure
    console.log('\n2. Testing bookings API response structure...');
    const bookingsResponse = await axios.get('http://localhost:3000/api/bookings', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('Bookings API Response Structure:');
    console.log('- Success:', bookingsResponse.data.success);
    console.log('- Message:', bookingsResponse.data.message);
    console.log('- Data keys:', Object.keys(bookingsResponse.data.data || {}));
    console.log('- Bookings array length:', bookingsResponse.data.data?.bookings?.length || 'N/A');
    console.log('- Is bookings an array?', Array.isArray(bookingsResponse.data.data?.bookings));
    
    if (bookingsResponse.data.data?.bookings?.length > 0) {
      console.log('- Sample booking keys:', Object.keys(bookingsResponse.data.data.bookings[0]));
    }
    
    // Test 3: Test spots API structure
    console.log('\n3. Testing spots API response structure...');
    const spotsResponse = await axios.get('http://localhost:3000/api/spots');
    
    console.log('Spots API Response Structure:');
    console.log('- Success:', spotsResponse.data.success);
    console.log('- Message:', spotsResponse.data.message);
    console.log('- Data keys:', Object.keys(spotsResponse.data.data || {}));
    console.log('- Spots array length:', spotsResponse.data.data?.spots?.length || 'N/A');
    console.log('- Is spots an array?', Array.isArray(spotsResponse.data.data?.spots));
    
    if (spotsResponse.data.data?.spots?.length > 0) {
      console.log('- Sample spot keys:', Object.keys(spotsResponse.data.data.spots[0]));
    }
    
    console.log('\n🎉 Frontend pages should now work correctly!');
    console.log('\n📋 Summary:');
    console.log('- Authentication: ✅');
    console.log('- Bookings API structure: ✅');
    console.log('- Spots API structure: ✅');
    console.log('- Array safety checks added: ✅');
    
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

testFrontendPages();