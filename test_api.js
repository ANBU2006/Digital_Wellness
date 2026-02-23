const axios = require('axios');

const API_URL = 'http://localhost:5000';

async function testAPI() {
  try {
    // Test 1: Health check
    console.log('Test 1: Health check');
    const healthRes = await axios.get(`${API_URL}/api/health`);
    console.log('✓ Server is running:', healthRes.data);
    
    // Test 2: Register a new user
    console.log('\nTest 2: Register user');
    const registerRes = await axios.post(`${API_URL}/api/auth/register`, {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'testPassword123'
    });
    console.log('✓ User registered:', registerRes.data.user);
    const token = registerRes.data.token;
    console.log('✓ Token received:', token.substring(0, 20) + '...');
    
    // Test 3: Get user info (with token)
    console.log('\nTest 3: Get user info');
    const meRes = await axios.get(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✓ User info retrieved:', meRes.data.user);
    
    // Test 4: Create wellness entry
    console.log('\nTest 4: Create wellness entry');
    const entryRes = await axios.post(
      `${API_URL}/api/wellness`,
      {
        studyHours: 4,
        screenTime: 5,
        sleepHours: 7,
        exerciseMinutes: 30,
        date: new Date().toISOString().split('T')[0]
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✓ Entry created:', entryRes.data);
    
    // Test 5: Get wellness entries
    console.log('\nTest 5: Get wellness entries');
    const entriesRes = await axios.get(`${API_URL}/api/wellness`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✓ Entries retrieved:', entriesRes.data.length, 'entries');
    
    console.log('\n✓ All tests passed!');
  } catch (error) {
    console.error('✗ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

testAPI();
