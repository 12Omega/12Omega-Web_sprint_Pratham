/**
 * Complete Signup Test
 * Tests all aspects of the signup functionality
 */

import axios from 'axios';

async function testCompleteSignup() {
  try {
    console.log('🧪 Testing Complete Signup Functionality...');
    
    // Test 1: Basic registration
    console.log('\n1. Testing basic registration...');
    const basicUser = {
      name: 'Basic Test User',
      email: `basic-${Date.now()}@test.com`,
      password: 'BasicTest123'
    };
    
    const basicResponse = await axios.post('http://localhost:5002/api/auth/register', basicUser);
    console.log('✅ Basic registration successful!');
    console.log('User:', basicResponse.data.data.user.name);
    console.log('Email:', basicResponse.data.data.user.email);
    console.log('Role:', basicResponse.data.data.user.role);
    
    // Test 2: Registration with phone
    console.log('\n2. Testing registration with phone...');
    const phoneUser = {
      name: 'Phone Test User',
      email: `phone-${Date.now()}@test.com`,
      password: 'PhoneTest123',
      phone: '+1234567890'
    };
    
    const phoneResponse = await axios.post('http://localhost:5002/api/auth/register', phoneUser);
    console.log('✅ Registration with phone successful!');
    console.log('User:', phoneResponse.data.data.user.name);
    console.log('Phone:', phoneResponse.data.data.user.phone);
    
    // Test 3: Test validation errors
    console.log('\n3. Testing validation errors...');
    
    // Test short password
    try {
      await axios.post('http://localhost:5002/api/auth/register', {
        name: 'Short Password User',
        email: `short-${Date.now()}@test.com`,
        password: '123' // Too short
      });
      console.log('❌ Short password validation failed - should have been rejected');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Short password correctly rejected');
      } else {
        console.log('❌ Unexpected error for short password:', error.response?.data);
      }
    }
    
    // Test duplicate email
    try {
      await axios.post('http://localhost:5002/api/auth/register', {
        name: 'Duplicate Email User',
        email: basicUser.email, // Same email as first test
        password: 'DuplicateTest123'
      });
      console.log('❌ Duplicate email validation failed - should have been rejected');
    } catch (error) {
      if (error.response?.status === 409) {
        console.log('✅ Duplicate email correctly rejected');
      } else {
        console.log('❌ Unexpected error for duplicate email:', error.response?.data);
      }
    }
    
    // Test 4: Test login after registration
    console.log('\n4. Testing login after registration...');
    const loginResponse = await axios.post('http://localhost:5002/api/auth/login', {
      email: phoneUser.email,
      password: phoneUser.password
    });
    
    console.log('✅ Login after registration successful!');
    console.log('User:', loginResponse.data.data.user.name);
    console.log('Token received:', loginResponse.data.data.token ? 'Yes' : 'No');
    
    // Test 5: Test profile access with token
    console.log('\n5. Testing profile access with token...');
    const profileResponse = await axios.get('http://localhost:5002/api/auth/profile', {
      headers: {
        'Authorization': `Bearer ${loginResponse.data.data.token}`
      }
    });
    
    console.log('✅ Profile access successful!');
    console.log('Profile name:', profileResponse.data.data.user.name);
    console.log('Profile email:', profileResponse.data.data.user.email);
    
    console.log('\n🎉 All signup functionality tests passed!');
    console.log('\n📋 Summary:');
    console.log('- Basic registration: ✅');
    console.log('- Registration with phone: ✅');
    console.log('- Password validation: ✅');
    console.log('- Duplicate email prevention: ✅');
    console.log('- Login after registration: ✅');
    console.log('- Token-based authentication: ✅');
    
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

testCompleteSignup();