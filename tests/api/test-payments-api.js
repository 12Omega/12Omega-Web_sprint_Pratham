/**
 * Test Payments API
 * Tests the payments API structure to understand the data format
 */

import axios from 'axios';

async function testPaymentsAPI() {
  try {
    console.log('💳 Testing Payments API...');
    
    // Get auth token
    const loginResponse = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'admin@parkease.com',
      password: 'password123'
    });
    const authToken = loginResponse.data.data.token;
    console.log('✅ Authentication successful');
    
    // Test payments API
    const paymentsResponse = await axios.get('http://localhost:3000/api/payments', {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    
    console.log('\n💳 PAYMENTS API STRUCTURE:');
    console.log('Response structure:', Object.keys(paymentsResponse.data));
    console.log('Total payments:', paymentsResponse.data.data?.payments?.length || paymentsResponse.data.length || 'Unknown');
    
    if (paymentsResponse.data.data?.payments?.length > 0) {
      console.log('\n💳 SAMPLE PAYMENT OBJECT:');
      const samplePayment = paymentsResponse.data.data.payments[0];
      console.log(JSON.stringify(samplePayment, null, 2));
      
      console.log('\n💳 PAYMENT FIELD ANALYSIS:');
      console.log('- booking exists:', !!samplePayment.booking);
      console.log('- booking is null:', samplePayment.booking === null);
      
      if (samplePayment.booking) {
        console.log('- booking._id exists:', !!samplePayment.booking._id);
        console.log('- booking.parkingSpot exists:', !!samplePayment.booking.parkingSpot);
        if (samplePayment.booking.parkingSpot) {
          console.log('- parkingSpot keys:', Object.keys(samplePayment.booking.parkingSpot));
          console.log('- parkingSpot.spotNumber exists:', !!samplePayment.booking.parkingSpot.spotNumber);
          console.log('- parkingSpot.name exists:', !!samplePayment.booking.parkingSpot.name);
        }
      }
      
      // Check for null bookings
      const nullBookings = paymentsResponse.data.data.payments.filter(p => p.booking === null);
      console.log('- Payments with null bookings:', nullBookings.length);
      
      if (nullBookings.length > 0) {
        console.log('- Sample null booking payment:', JSON.stringify(nullBookings[0], null, 2));
      }
    }
    
    console.log('\n🎉 Payments API analysis complete!');
    
  } catch (error) {
    console.log('\n❌ Test failed:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Network error:', error.message);
    }
  }
}

testPaymentsAPI();