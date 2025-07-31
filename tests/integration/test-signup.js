/**
 * Test Signup/Registration Script
 * Tests user registration with new credentials
 */

import axios from 'axios';

async function testSignup() {
  try {
    console.log('🧪 Testing ParkEase User Registration...');
    
    // Test 1: Register a completely new user
    console.log('\n1. Testing new user registration...');
    const newUserData = {
      name: 'Test New User',
      email: 'newuser@test.com',
      password: 'NewPassword123',
      phone: '+1234567890'
    };
    
    console.log('Sending registration request...');
    console.log('Data:', JSON.stringify(newUserData, null, 2));
    
    const registerResponse = await axios.post('http://localhost:5002/api/auth/register', newUserData);
    
    console.log('✅ Registration successful!');
    console.log('Response status:', registerResponse.status);
    console.log('User created:', registerResponse.data.data?.user?.name || registerResponse.data.user?.name);
    console.log('Email:', registerResponse.data.data?.user?.email || registerResponse.data.user?.email);
    console.log('Token received:', registerResponse.data.data?.token || registerResponse.data.token ? 'Yes' : 'No');
    
    // Test 2: Try to login with the new credentials
    console.log('\n2. Testing login with new credentials...');
    const loginResponse = await axios.post('http://localhost:5002/api/auth/login', {
      email: newUserData.email,
      password: newUserData.password
    });
    
    console.log('✅ Login with new credentials successful!');
    console.log('Welcome:', loginResponse.data.data?.user?.name || loginResponse.data.user?.name);
    
    console.log('\n🎉 Signup functionality is working correctly!');
    
  } catch (error) {
    console.log('\n❌ Signup test failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error data:', JSON.stringify(error.response.data, null, 2));
      
      if (error.response.status === 409) {
        console.log('\n💡 User already exists. Trying with different email...');
        
        // Try with a different email
        const alternativeUserData = {
          name: 'Alternative Test User',
          email: `testuser${Date.now()}@test.com`, // Unique email
          password: 'NewPassword123',
          phone: '+1234567891'
        };
        
        try {
          console.log('\nTrying alternative registration...');
          const altRegisterResponse = await axios.post('http://localhost:5002/api/auth/register', alternativeUserData);
          console.log('✅ Alternative registration successful!');
          console.log('User:', altRegisterResponse.data.data?.user?.name || altRegisterResponse.data.user?.name);
        } catch (altError) {
          console.log('❌ Alternative registration also failed:');
          console.log('Status:', altError.response?.status);
          console.log('Error:', JSON.stringify(altError.response?.data, null, 2));
        }
      }
    } else {
      console.log('Network error:', error.message);
      console.log('\n💡 Make sure the server is running on port 5002');
    }
  }
}

testSignup();