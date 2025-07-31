/**
 * Test Frontend Signup Flow
 * Tests the complete signup flow including API proxy
 */

import axios from 'axios';

async function testFrontendSignup() {
  try {
    console.log('🧪 Testing Frontend Signup Flow...');
    
    // Test 1: Test the API proxy (frontend to backend)
    console.log('\n1. Testing API proxy through frontend port...');
    const frontendApiUrl = 'http://localhost:3000/api/auth/register';
    
    const newUserData = {
      name: 'Frontend Test User',
      email: `frontend-test-${Date.now()}@test.com`,
      password: 'FrontendTest123',
      phone: '+1234567890'
    };
    
    console.log('Sending request to frontend proxy:', frontendApiUrl);
    console.log('Data:', JSON.stringify(newUserData, null, 2));
    
    try {
      const proxyResponse = await axios.post(frontendApiUrl, newUserData);
      console.log('✅ Frontend proxy registration successful!');
      console.log('Status:', proxyResponse.status);
      console.log('User:', proxyResponse.data.data?.user?.name);
      console.log('Token received:', proxyResponse.data.data?.token ? 'Yes' : 'No');
      
      // Test login through proxy
      console.log('\n2. Testing login through frontend proxy...');
      const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
        email: newUserData.email,
        password: newUserData.password
      });
      
      console.log('✅ Frontend proxy login successful!');
      console.log('User:', loginResponse.data.data?.user?.name);
      
    } catch (proxyError) {
      console.log('❌ Frontend proxy failed:');
      console.log('Status:', proxyError.response?.status);
      console.log('Error:', JSON.stringify(proxyError.response?.data, null, 2));
      
      if (proxyError.code === 'ECONNREFUSED') {
        console.log('\n💡 Frontend server might not be running on port 3000');
        console.log('Make sure you run: npm run dev');
      }
    }
    
    // Test 2: Direct backend test (for comparison)
    console.log('\n3. Testing direct backend registration (for comparison)...');
    const directUserData = {
      name: 'Direct Test User',
      email: `direct-test-${Date.now()}@test.com`,
      password: 'DirectTest123',
      phone: '+1234567891'
    };
    
    const directResponse = await axios.post('http://localhost:5002/api/auth/register', directUserData);
    console.log('✅ Direct backend registration successful!');
    console.log('User:', directResponse.data.data?.user?.name);
    
    console.log('\n🎉 All tests completed!');
    
  } catch (error) {
    console.log('\n❌ Test failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('Network error:', error.message);
    }
  }
}

testFrontendSignup();