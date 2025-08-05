#!/usr/bin/env node

/**
 * Quick Test Validation
 * Validates that basic functionality works before running full test suite
 */

import axios from 'axios';

async function validateBasics() {
  console.log('🔍 Quick Test Validation');
  console.log('=' .repeat(25));
  
  try {
    // Test 1: Server health
    console.log('\n1. Testing server health...');
    const health = await axios.get('http://localhost:5002/api/health');
    console.log('✅ Server is healthy');
    
    // Test 2: Database connection (via spots endpoint)
    console.log('\n2. Testing database connection...');
    const spots = await axios.get('http://localhost:5002/api/spots');
    console.log(`✅ Database connected (found ${spots.data.data?.spots?.length || 0} spots)`);
    
    // Test 3: Authentication endpoint
    console.log('\n3. Testing auth endpoint...');
    try {
      await axios.post('http://localhost:5002/api/auth/login', {
        email: 'test@test.com',
        password: 'wrongpassword'
      });
    } catch (authError) {
      if (authError.response?.status === 400 || authError.response?.status === 401) {
        console.log('✅ Auth endpoint responding correctly');
      } else {
        throw authError;
      }
    }
    
    console.log('\n🎉 Basic validation passed! Ready for full test suite.');
    
  } catch (error) {
    console.log('\n❌ Validation failed:');
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Server is not running. Start it with: npm run server');
    } else {
      console.log('Error:', error.message);
    }
    process.exit(1);
  }
}

validateBasics();