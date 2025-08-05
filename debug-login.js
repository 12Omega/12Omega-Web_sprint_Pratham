import axios from 'axios';

async function debugLogin() {
  try {
    console.log('🔍 Debugging login issue...');
    
    // First, test if server is responding
    console.log('\n1. Testing server health...');
    const healthResponse = await axios.get('http://localhost:5002/api/health');
    console.log('✅ Server is responding:', healthResponse.data.message);
    
    // Test login with seeded admin user
    console.log('\n2. Testing admin login...');
    const loginData = {
      email: 'admin@parkease.com',
      password: 'password123'
    };
    
    console.log('Login data:', loginData);
    
    const loginResponse = await axios.post('http://localhost:5002/api/auth/login', loginData);
    console.log('✅ Login successful!');
    console.log('Response:', loginResponse.data);
    
  } catch (error) {
    console.log('\n❌ Error occurred:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      console.log('Headers:', error.response.headers);
    } else if (error.request) {
      console.log('No response received:', error.request);
    } else {
      console.log('Error:', error.message);
    }
  }
}

debugLogin();