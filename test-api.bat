@echo off
echo ========================================
echo HR Backend API Testing Script
echo ========================================
echo.

REM Set base URL
set BASE_URL=http://localhost:3000/api

echo 🏥 Testing Health Check...
curl -s http://localhost:3000/health
echo.
echo.

echo 📝 Testing User Registration...
curl -s -X POST %BASE_URL%/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test%RANDOM%@example.com\",\"password\":\"TestPass123!\",\"phone\":\"+1234567890\",\"role\":\"employee\"}"
echo.
echo.

echo 🔑 Testing User Login...
curl -s -X POST %BASE_URL%/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"password\":\"TestPass123!\"}"
echo.
echo.

echo 🚫 Testing Invalid Token...
curl -s -X GET %BASE_URL%/auth/profile ^
  -H "Authorization: Bearer invalid_token"
echo.
echo.

echo ⚠️ Testing Validation Error...
curl -s -X POST %BASE_URL%/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"\",\"email\":\"invalid-email\",\"password\":\"123\"}"
echo.
echo.

echo ✅ Basic API tests completed!
echo.
echo 💡 For more comprehensive testing:
echo 1. Import HR_Backend_API.postman_collection.json into Postman
echo 2. Run: node test-api.js (requires Node.js 18+)
echo 3. Check API_TESTING_GUIDE.md for detailed examples
echo.
pause


