#!/usr/bin/env node

/**
 * Simple API Test Script for HR Backend
 * Run with: node test-api.js
 */

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const BASE_URL = `http://localhost:${PORT}/api`;
let accessToken = '';
let refreshToken = '';
let userId = '';

// Helper function to make HTTP requests
async function makeRequest(method, endpoint, data = null, token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    
    console.log(`\n🔍 ${method} ${endpoint}`);
    console.log(`Status: ${response.status}`);
    console.log('Response:', JSON.stringify(responseData, null, 2));
    
    return { status: response.status, data: responseData };
  } catch (error) {
    console.error(`❌ Error making request to ${endpoint}:`, error.message);
    return null;
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\n🏥 Testing Health Check...');
  try {
    const response = await fetch(`http://localhost:${PORT}/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data);
    return response.ok;
  } catch (error) {
    console.error('❌ Health Check Failed:', error.message);
    return false;
  }
}

async function testUserRegistration() {
  console.log('\n📝 Testing User Registration...');
  const userData = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPass123!',
    phone: '+1234567890',
    role: 'employee'
  };

  const response = await makeRequest('POST', '/auth/register', userData);
  
  if (response && response.status === 201) {
    accessToken = response.data.data.tokens.accessToken;
    refreshToken = response.data.data.tokens.refreshToken;
    userId = response.data.data.user.id;
    console.log('✅ Registration successful');
    return true;
  } else {
    console.log('❌ Registration failed');
    return false;
  }
}

async function testUserLogin() {
  console.log('\n🔑 Testing User Login...');
  const loginData = {
    email: 'test@example.com',
    password: 'TestPass123!'
  };

  const response = await makeRequest('POST', '/auth/login', loginData);
  
  if (response && response.status === 200) {
    accessToken = response.data.data.tokens.accessToken;
    refreshToken = response.data.data.tokens.refreshToken;
    userId = response.data.data.user.id;
    console.log('✅ Login successful');
    return true;
  } else {
    console.log('❌ Login failed');
    return false;
  }
}

async function testGetProfile() {
  console.log('\n👤 Testing Get Profile...');
  const response = await makeRequest('GET', '/auth/profile', null, accessToken);
  
  if (response && response.status === 200) {
    console.log('✅ Get profile successful');
    return true;
  } else {
    console.log('❌ Get profile failed');
    return false;
  }
}

async function testUpdateProfile() {
  console.log('\n✏️ Testing Update Profile...');
  const updateData = {
    name: 'Updated Test User',
    department: 'Engineering',
    position: 'Software Developer'
  };

  const response = await makeRequest('PUT', '/auth/profile', updateData, accessToken);
  
  if (response && response.status === 200) {
    console.log('✅ Update profile successful');
    return true;
  } else {
    console.log('❌ Update profile failed');
    return false;
  }
}

async function testRefreshToken() {
  console.log('\n🔄 Testing Refresh Token...');
  const refreshData = {
    refreshToken: refreshToken
  };

  const response = await makeRequest('POST', '/auth/refresh-token', refreshData);
  
  if (response && response.status === 200) {
    accessToken = response.data.data.tokens.accessToken;
    refreshToken = response.data.data.tokens.refreshToken;
    console.log('✅ Refresh token successful');
    return true;
  } else {
    console.log('❌ Refresh token failed');
    return false;
  }
}

async function testGetUsers() {
  console.log('\n👥 Testing Get Users...');
  const response = await makeRequest('GET', '/users?page=1&limit=5', null, accessToken);
  
  if (response && response.status === 200) {
    console.log('✅ Get users successful');
    return true;
  } else {
    console.log('❌ Get users failed');
    return false;
  }
}

async function testSearchUsers() {
  console.log('\n🔍 Testing Search Users...');
  const response = await makeRequest('GET', '/users/search?q=test&page=1&limit=5', null, accessToken);
  
  if (response && response.status === 200) {
    console.log('✅ Search users successful');
    return true;
  } else {
    console.log('❌ Search users failed');
    return false;
  }
}

async function testInvalidToken() {
  console.log('\n🚫 Testing Invalid Token...');
  const response = await makeRequest('GET', '/auth/profile', null, 'invalid_token');
  
  if (response && response.status === 401) {
    console.log('✅ Invalid token handling working correctly');
    return true;
  } else {
    console.log('❌ Invalid token handling failed');
    return false;
  }
}

async function testValidationError() {
  console.log('\n⚠️ Testing Validation Error...');
  const invalidData = {
    name: '',
    email: 'invalid-email',
    password: '123'
  };

  const response = await makeRequest('POST', '/auth/register', invalidData);
  
  if (response && response.status === 400) {
    console.log('✅ Validation error handling working correctly');
    return true;
  } else {
    console.log('❌ Validation error handling failed');
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting HR Backend API Tests...\n');
  console.log('='.repeat(50));

  const tests = [
    { name: 'Health Check', fn: testHealthCheck },
    { name: 'User Registration', fn: testUserRegistration },
    { name: 'User Login', fn: testUserLogin },
    { name: 'Get Profile', fn: testGetProfile },
    { name: 'Update Profile', fn: testUpdateProfile },
    { name: 'Refresh Token', fn: testRefreshToken },
    { name: 'Get Users', fn: testGetUsers },
    { name: 'Search Users', fn: testSearchUsers },
    { name: 'Invalid Token', fn: testInvalidToken },
    { name: 'Validation Error', fn: testValidationError }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test.fn();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.error(`❌ ${test.name} threw an error:`, error.message);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your API is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Please check your server and configuration.');
  }
}

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or a fetch polyfill.');
  console.log('💡 Install a fetch polyfill: npm install node-fetch');
  process.exit(1);
}

// Run tests
runTests().catch(console.error);


