import axios from 'axios';

async function testAuth() {
  try {
    console.log('🧪 Testing ParkEase Authentication...');
    
    // First, let's register a new user with known credentials
    console.log('\n1. Registering a new test user...');
    const registerData = {
      name: 'Test User New',
      email: 'testuser@parkease.com',
      password: 'Password123' // Meets requirements: lowercase, uppercase, number
    };
    
    try {
      console.log('Sending registration request to http://localhost:5002/api/auth/register');
      const registerResponse = await axios.post('http://localhost:5002/api/auth/register', registerData);
      console.log('✅ Registration successful!');
      console.log('Response data:', registerResponse.data);
      
      if (registerResponse.data.data?.user) {
        console.log('User:', registerResponse.data.data.user.name);
        console.log('Token received:', registerResponse.data.data.token ? 'Yes' : 'No');
      } else if (registerResponse.data.user) {
        console.log('User:', registerResponse.data.user.name);
        console.log('Token received:', registerResponse.data.token ? 'Yes' : 'No');
      }
    } catch (regError) {
      if (regError.response?.status === 409 || 
          (regError.response?.status === 400 && regError.response?.data?.message?.includes('already exists'))) {
        console.log('ℹ️ User already exists, proceeding to login test...');
      } else {
        console.log('❌ Registration failed:');
        console.log('Status:', regError.response?.status);
        console.log('Data:', regError.response?.data);
        if (!regError.response) {
          console.log('Error message:', regError.message);
          console.log('Is the server running at http://localhost:5000?');
        }
      }
    }
    
    // Now test login with the known credentials
    console.log('\n2. Testing login with known credentials...');
    const loginResponse = await axios.post('http://localhost:5002/api/auth/login', {
      email: 'testuser@parkease.com',
      password: 'Password123' // Updated to match registration password
    });
    
    console.log('✅ Login successful!');
    // Handle both response formats (TypeScript controller vs JavaScript controller)
    const userData = loginResponse.data.data?.user || loginResponse.data.user;
    const token = loginResponse.data.data?.token || loginResponse.data.token;
    
    console.log('User:', userData.name);
    console.log('Email:', userData.email);
    console.log('Role:', userData.role);
    console.log('Token received:', token ? 'Yes' : 'No');
    
    console.log('\n🎉 Authentication is working correctly!');
    
  } catch (error) {
    console.log('\n❌ Test failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testAuth();