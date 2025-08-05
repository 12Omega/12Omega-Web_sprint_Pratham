/**
 * Test Registration Script
 * Run this to test if the registration endpoint is working
 */

import axios from 'axios';

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
      email: `test-${Date.now()}@parkease.com`, // Use unique email
      password: 'Password123',
      phone: '+1234567890'
    };
    
    try {
      const registerResponse = await axios.post('http://localhost:5002/api/auth/register', userData);
      console.log('✅ Registration successful!');
      const user = registerResponse.data.data?.user || registerResponse.data.user;
      const token = registerResponse.data.data?.token || registerResponse.data.token;
      console.log('User ID:', user?.id || 'Unknown');
      console.log('Token received:', token ? 'Yes' : 'No');
    } catch (regError) {
      if (regError.response?.status === 400 && regError.response?.data?.message?.includes('already exists')) {
        console.log('ℹ️ User already exists, testing with existing user...');
        userData.email = 'john@example.com'; // Use seeded user
        userData.password = 'password123';
      } else {
        throw regError;
      }
    }
    
    // Test 3: Test login
    console.log('\n3. Testing user login...');
    const loginData = {
      email: userData.email, // Use the same email from registration
      password: userData.password // Use the same password from registration
    };
    
    const loginResponse = await axios.post('http://localhost:5002/api/auth/login', loginData);
    console.log('✅ Login successful!');
    console.log('Welcome:', loginResponse?.data?.user || response.data.user.name);
    
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