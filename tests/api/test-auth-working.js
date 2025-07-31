/**
 * Working Authentication Test Script
 * Tests login with the correct seeded user credentials
 */

import axios from 'axios';

async function testWorkingAuth() {
  try {
    console.log('🧪 Testing ParkEase Authentication with correct credentials...');
    
    // Test with seeded admin user
    console.log('\n1. Testing admin login...');
    const adminLogin = await axios.post('http://localhost:5002/api/auth/login', {
      email: 'admin@parkease.com',
      password: 'password123' // This matches the seeded password
    });
    
    console.log('✅ Admin login successful!');
    console.log('User:', adminLogin.data.data.user.name);
    console.log('Role:', adminLogin.data.data.user.role);
    console.log('Token received:', adminLogin.data.data.token ? 'Yes' : 'No');
    
    // Test with seeded regular user
    console.log('\n2. Testing regular user login...');
    const userLogin = await axios.post('http://localhost:5002/api/auth/login', {
      email: 'john@example.com',
      password: 'password123' // This matches the seeded password
    });
    
    console.log('✅ User login successful!');
    console.log('User:', userLogin.data.data.user.name);
    console.log('Role:', userLogin.data.data.user.role);
    console.log('Token received:', userLogin.data.data.token ? 'Yes' : 'No');
    
    // Test profile access with token
    console.log('\n3. Testing profile access...');
    const profileResponse = await axios.get('http://localhost:5002/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${userLogin.data.data.token}`
      }
    });
    
    console.log('✅ Profile access successful!');
    console.log('Profile:', profileResponse.data.data.user.name);
    
    console.log('\n🎉 All authentication tests passed!');
    console.log('\n📝 Available test users:');
    console.log('- admin@parkease.com (password: password123) - Admin user');
    console.log('- john@example.com (password: password123) - Regular user');
    console.log('- sarah@example.com (password: password123) - Regular user');
    console.log('- michael@example.com (password: password123) - Regular user');
    console.log('- emily@example.com (password: password123) - Regular user');
    console.log('- david@example.com (password: password123) - Regular user');
    
  } catch (error) {
    console.log('\n❌ Test failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
      
      if (error.response.status === 401) {
        console.log('\n💡 Tip: Make sure you have seeded the database first:');
        console.log('Run: npm run seed');
      }
    } else {
      console.log('Error:', error.message);
      console.log('\n💡 Make sure the server is running on port 5002');
    }
  }
}

testWorkingAuth();