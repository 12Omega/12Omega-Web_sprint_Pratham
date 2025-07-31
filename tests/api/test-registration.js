/**
 * Test Registration Script
 * Run this to test if the registration endpoint is working
 */

const axios = require('axios');

async function testRegistration() {
  try {
    console.log('🧪 Testing ParkEase Registration...');
    
    // Test 1: Check if server is running
    console.log('\n1. Testing server health...');
    const healthResponse = await axios.get('http://localhost:5002/api/health');
    console.log('✅ Server is running:', healthResponse.data.message);
    
    // Test 2: Test registration
    console.log('\n2. Testing user registration...');
    const userData = {
      name: 'Test User',
      email: 'test@parkease.com',
      password: 'Password123',
      phone: '+1234567890'
    };
    
    const registerResponse = await axios.post('http://localhost:5002/api/auth/register', userData);
    console.log('✅ Registration successful!');
    console.log('User ID:', registerResponse.data.data.user.id);
    console.log('Token received:', registerResponse.data.data.token ? 'Yes' : 'No');
    
    // Test 3: Test login
    console.log('\n3. Testing user login...');
    const loginData = {
      email: 'test@parkease.com',
      password: 'Password123'
    };
    
    const loginResponse = await axios.post('http://localhost:5002/api/auth/login', loginData);
    console.log('✅ Login successful!');
    console.log('Welcome:', loginResponse.data.data.user.name);
    
    console.log('\n🎉 All tests passed! Your backend is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Is the server running?');
      console.error('Make sure you run: npm run dev');
    } else {
      console.error('Error:', error.message);
    }
  }
}

testRegistration();