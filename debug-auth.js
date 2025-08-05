import axios from 'axios';

const debugAuth = async () => {
  console.log('🔍 Debugging Authentication Flow\n');
  
  try {
    // Step 1: Login
    console.log('Step 1: Logging in...');
    const loginResponse = await axios.post('http://localhost:5002/api/auth/login', {
      email: 'admin@parkease.com',
      password: 'password123'
    });
    
    const { token, user } = loginResponse.data;
    console.log('✅ Login successful');
    console.log('Token:', token.substring(0, 20) + '...');
    console.log('User:', user.name, '(' + user.role + ')');
    
    // Step 2: Test profile endpoint with token
    console.log('\nStep 2: Testing profile endpoint...');
    const profileResponse = await axios.get('http://localhost:5002/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Profile endpoint working');
    console.log('Profile data:', profileResponse.data.name);
    
    // Step 3: Test bookings endpoint with token
    console.log('\nStep 3: Testing bookings endpoint...');
    const bookingsResponse = await axios.get('http://localhost:5002/api/bookings', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Bookings endpoint working');
    console.log('Bookings count:', bookingsResponse.data.data?.length || 0);
    
    console.log('\n🎉 All authentication tests passed!');
    
  } catch (error) {
    console.log('❌ Authentication test failed!');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
};

debugAuth().catch(console.error);