import axios from 'axios';

const testLogin = async (email, password) => {
  try {
    console.log(`\nTesting login for: ${email}`);
    const response = await axios.post('http://localhost:5002/api/auth/login', {
      email: email,
      password: password
    });
    
    console.log('✅ Login successful!');
    console.log('User:', response.data.user.name);
    console.log('Role:', response.data.user.role);
    console.log('Token received:', response.data.token ? 'Yes' : 'No');
    return true;
  } catch (error) {
    console.log('❌ Login failed!');
    if (error.response) {
      console.log('Error:', error.response.data.message);
    } else {
      console.log('Error:', error.message);
    }
    return false;
  }
};

const runTests = async () => {
  console.log('🔐 Testing ParkEase Login Credentials\n');
  
  const credentials = [
    { email: 'admin@parkease.com', password: 'password123', role: 'Admin' },
    { email: 'john@example.com', password: 'password123', role: 'User' },
    { email: 'sarah@example.com', password: 'password123', role: 'User' },
    { email: 'michael@example.com', password: 'password123', role: 'User' },
    { email: 'emily@example.com', password: 'password123', role: 'User' },
    { email: 'david@example.com', password: 'password123', role: 'User' }
  ];
  
  let successCount = 0;
  
  for (const cred of credentials) {
    const success = await testLogin(cred.email, cred.password);
    if (success) successCount++;
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between requests
  }
  
  console.log(`\n📊 Results: ${successCount}/${credentials.length} credentials working`);
  
  if (successCount === credentials.length) {
    console.log('🎉 All credentials are working correctly!');
  } else {
    console.log('⚠️  Some credentials are not working. Check the database or server.');
  }
};

runTests().catch(console.error);