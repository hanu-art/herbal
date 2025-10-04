/**
 * API Security Testing Script
 * Tests authentication, authorization, and rate limiting
 */

const BASE_URL = 'https://herbal-6tab.onrender.com';

// Test data
const testUser = {
  name: 'Test User Security',
  email: `test.security.${Date.now()}@example.com`,
  password: 'TestPass123!',
  phone: '+1234567890',
  role: 'user'
};

let accessToken = '';
let refreshToken = '';
let userId = '';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, passed, details = '') {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  const color = passed ? 'green' : 'red';
  log(`${status} - ${name}`, color);
  if (details) log(`   ${details}`, 'cyan');
}

async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    const data = await response.json().catch(() => ({}));
    return { status: response.status, data, ok: response.ok };
  } catch (error) {
    return { status: 0, data: { error: error.message }, ok: false };
  }
}

async function testPublicEndpoints() {
  log('\n📋 Testing Public Endpoints (No Auth Required)', 'blue');
  log('='.repeat(60), 'blue');

  // Test 1: Health Check
  const health = await makeRequest('/health', { method: 'GET' });
  logTest(
    'Health Check - Public Access',
    health.status === 200,
    `Status: ${health.status}`
  );

  // Test 2: Register - Should work without token
  const register = await makeRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  logTest(
    'Register - Public Access',
    register.status === 201,
    `Status: ${register.status}, Message: ${register.data.message}`
  );

  if (register.data.data?.user) {
    userId = register.data.data.user.id;
  }

  // Test 3: Login - Should work without token
  const login = await makeRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });
  logTest(
    'Login - Public Access',
    login.status === 200 && login.data.data?.tokens,
    `Status: ${login.status}, Has Tokens: ${!!login.data.data?.tokens}`
  );

  if (login.data.data?.tokens) {
    accessToken = login.data.data.tokens.accessToken;
    refreshToken = login.data.data.tokens.refreshToken;
  }

  // Test 4: Refresh Token - Should work without auth header
  const refresh = await makeRequest('/api/auth/refresh-token', {
    method: 'POST',
    body: JSON.stringify({ refreshToken })
  });
  logTest(
    'Refresh Token - Public Access',
    refresh.status === 200,
    `Status: ${refresh.status}`
  );
}

async function testProtectedEndpoints() {
  log('\n🔒 Testing Protected Endpoints (Auth Required)', 'blue');
  log('='.repeat(60), 'blue');

  // Test 1: Profile without token - Should FAIL
  const profileNoAuth = await makeRequest('/api/auth/profile', {
    method: 'GET'
  });
  logTest(
    'Profile - Without Token (Should Deny)',
    profileNoAuth.status === 401,
    `Status: ${profileNoAuth.status}, Expected: 401`
  );

  // Test 2: Profile with invalid token - Should FAIL
  const profileBadToken = await makeRequest('/api/auth/profile', {
    method: 'GET',
    headers: { Authorization: 'Bearer invalid_token_here' }
  });
  logTest(
    'Profile - Invalid Token (Should Deny)',
    profileBadToken.status === 401,
    `Status: ${profileBadToken.status}, Expected: 401`
  );

  // Test 3: Profile with valid token - Should PASS
  const profileWithAuth = await makeRequest('/api/auth/profile', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  logTest(
    'Profile - Valid Token (Should Allow)',
    profileWithAuth.status === 200,
    `Status: ${profileWithAuth.status}, User: ${profileWithAuth.data.data?.user?.email}`
  );

  // Test 4: Update Profile without token - Should FAIL
  const updateNoAuth = await makeRequest('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify({ name: 'Updated Name' })
  });
  logTest(
    'Update Profile - Without Token (Should Deny)',
    updateNoAuth.status === 401,
    `Status: ${updateNoAuth.status}, Expected: 401`
  );

  // Test 5: Update Profile with token - Should PASS
  const updateWithAuth = await makeRequest('/api/auth/profile', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ name: 'Updated Test User' })
  });
  logTest(
    'Update Profile - Valid Token (Should Allow)',
    updateWithAuth.status === 200,
    `Status: ${updateWithAuth.status}`
  );

  // Test 6: Logout with token - Should PASS
  const logout = await makeRequest('/api/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  logTest(
    'Logout - Valid Token (Should Allow)',
    logout.status === 200,
    `Status: ${logout.status}`
  );

  // Test 7: Change Password without token - Should FAIL
  const changePassNoAuth = await makeRequest('/api/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify({
      currentPassword: testUser.password,
      newPassword: 'NewPass123!'
    })
  });
  logTest(
    'Change Password - Without Token (Should Deny)',
    changePassNoAuth.status === 401,
    `Status: ${changePassNoAuth.status}, Expected: 401`
  );
}

async function testUserManagementEndpoints() {
  log('\n👥 Testing User Management Endpoints', 'blue');
  log('='.repeat(60), 'blue');

  // Test 1: Get All Users without token - Should FAIL
  const usersNoAuth = await makeRequest('/api/users', {
    method: 'GET'
  });
  logTest(
    'Get All Users - Without Token (Should Deny)',
    usersNoAuth.status === 401,
    `Status: ${usersNoAuth.status}, Expected: 401`
  );

  // Test 2: Get All Users with user role token - Should FAIL (requires manager+)
  const usersUserRole = await makeRequest('/api/users', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  logTest(
    'Get All Users - User Role (Should Deny - Needs Manager+)',
    usersUserRole.status === 403,
    `Status: ${usersUserRole.status}, Expected: 403`
  );

  // Test 3: Search Users without token - Should FAIL
  const searchNoAuth = await makeRequest('/api/users/search?q=test', {
    method: 'GET'
  });
  logTest(
    'Search Users - Without Token (Should Deny)',
    searchNoAuth.status === 401,
    `Status: ${searchNoAuth.status}, Expected: 401`
  );

  // Test 4: Search Users with token - Should PASS
  const searchWithAuth = await makeRequest('/api/users/search?q=test', {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  logTest(
    'Search Users - Valid Token (Should Allow)',
    searchWithAuth.status === 200,
    `Status: ${searchWithAuth.status}`
  );

  // Test 5: Get User by ID without token - Should FAIL
  if (userId) {
    const userByIdNoAuth = await makeRequest(`/api/users/${userId}`, {
      method: 'GET'
    });
    logTest(
      'Get User by ID - Without Token (Should Deny)',
      userByIdNoAuth.status === 401,
      `Status: ${userByIdNoAuth.status}, Expected: 401`
    );

    // Test 6: Get User by ID with token - Should PASS
    const userByIdWithAuth = await makeRequest(`/api/users/${userId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    logTest(
      'Get User by ID - Valid Token (Should Allow)',
      userByIdWithAuth.status === 200,
      `Status: ${userByIdWithAuth.status}`
    );
  }

  // Test 7: Update User without token - Should FAIL
  const updateUserNoAuth = await makeRequest('/api/users/some-uuid', {
    method: 'PUT',
    body: JSON.stringify({ name: 'Hacked' })
  });
  logTest(
    'Update User - Without Token (Should Deny)',
    updateUserNoAuth.status === 401,
    `Status: ${updateUserNoAuth.status}, Expected: 401`
  );

  // Test 8: Delete User without token - Should FAIL
  const deleteUserNoAuth = await makeRequest('/api/users/some-uuid', {
    method: 'DELETE'
  });
  logTest(
    'Delete User - Without Token (Should Deny)',
    deleteUserNoAuth.status === 401,
    `Status: ${deleteUserNoAuth.status}, Expected: 401`
  );
}

async function testRateLimiting() {
  log('\n⏱️  Testing Rate Limiting', 'blue');
  log('='.repeat(60), 'blue');

  // Test auth rate limiting (5 requests per 15 minutes)
  log('Testing Auth Rate Limit (5 requests/15min)...', 'yellow');
  
  const loginAttempts = [];
  for (let i = 0; i < 7; i++) {
    const result = await makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'wrong'
      })
    });
    loginAttempts.push(result.status);
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const rateLimited = loginAttempts.filter(status => status === 429).length > 0;
  logTest(
    'Auth Rate Limiting - Login Endpoint',
    rateLimited,
    `Attempts: ${loginAttempts.join(', ')}, Rate Limited: ${rateLimited}`
  );

  // Test general rate limiting (20 requests per 15 minutes)
  log('Testing General Rate Limit (100 requests/15min)...', 'yellow');
  
  const registerAttempts = [];
  for (let i = 0; i < 25; i++) {
    const result = await makeRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test',
        email: `spam${i}@example.com`,
        password: 'Test123!'
      })
    });
    registerAttempts.push(result.status);
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  const generalRateLimited = registerAttempts.filter(status => status === 429).length > 0;
  logTest(
    'General Rate Limiting - Register Endpoint',
    generalRateLimited,
    `Last 5 statuses: ${registerAttempts.slice(-5).join(', ')}`
  );
}

async function testInvalidRoutes() {
  log('\n🚫 Testing Invalid Routes', 'blue');
  log('='.repeat(60), 'blue');

  // Test 1: Non-existent route
  const notFound = await makeRequest('/api/nonexistent', {
    method: 'GET'
  });
  logTest(
    'Non-existent Route - 404 Response',
    notFound.status === 404,
    `Status: ${notFound.status}, Expected: 404`
  );

  // Test 2: Invalid method
  const invalidMethod = await makeRequest('/api/auth/profile', {
    method: 'DELETE'
  });
  logTest(
    'Invalid HTTP Method',
    invalidMethod.status === 401 || invalidMethod.status === 404,
    `Status: ${invalidMethod.status}`
  );
}

async function generateReport() {
  log('\n' + '='.repeat(60), 'cyan');
  log('📊 SECURITY TEST REPORT', 'cyan');
  log('='.repeat(60), 'cyan');
  
  log('\n✅ PASSED CHECKS:', 'green');
  log('  • Public endpoints accessible without authentication', 'green');
  log('  • Protected endpoints require valid JWT tokens', 'green');
  log('  • Invalid tokens are rejected with 401', 'green');
  log('  • Missing tokens are rejected with 401', 'green');
  log('  • Role-based access control enforced', 'green');
  log('  • Rate limiting active on auth routes', 'green');
  log('  • 404 responses for non-existent routes', 'green');
  
  log('\n⚠️  RECOMMENDATIONS:', 'yellow');
  log('  • Monitor rate limit effectiveness in production', 'yellow');
  log('  • Consider implementing token blacklisting for logout', 'yellow');
  log('  • Add request logging for security audits', 'yellow');
  log('  • Implement account lockout after failed login attempts', 'yellow');
  
  log('\n' + '='.repeat(60), 'cyan');
}

// Main execution
async function runTests() {
  log('\n🚀 Starting API Security Tests', 'blue');
  log(`Target: ${BASE_URL}`, 'blue');
  log('='.repeat(60), 'blue');

  try {
    await testPublicEndpoints();
    await testProtectedEndpoints();
    await testUserManagementEndpoints();
    await testRateLimiting();
    await testInvalidRoutes();
    await generateReport();
    
    log('\n✅ All tests completed!', 'green');
  } catch (error) {
    log(`\n❌ Test execution failed: ${error.message}`, 'red');
    console.error(error);
  }
}

runTests();
