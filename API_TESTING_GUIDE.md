# 🧪 HR Backend API Testing Guide

## 📋 Base Configuration

**Base URL:** `http://localhost:3000/api`

**Headers for all requests:**
```json
{
  "Content-Type": "application/json"
}
```

**Authorization Header (for protected routes):**
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

---

## 🔐 Authentication Endpoints

### 1. User Registration

**POST** `/auth/register`

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "role": "employee"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "status": 201,
  "message": "User registered successfully",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "role": "employee",
      "department": null,
      "position": null,
      "created_at": "2024-01-15T10:30:00.000Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "15m"
    }
  }
}
```

### 2. User Login

**POST** `/auth/login`

```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Login successful",
  "timestamp": "2024-01-15T10:35:00.000Z",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "role": "employee",
      "department": null,
      "position": null
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "15m"
    }
  }
}
```

### 3. Refresh Token

**POST** `/auth/refresh-token`

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Token refreshed successfully",
  "timestamp": "2024-01-15T10:40:00.000Z",
  "data": {
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "15m"
    }
  }
}
```

### 4. Get User Profile

**GET** `/auth/profile`
**Headers:** `Authorization: Bearer YOUR_ACCESS_TOKEN`

**Success Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Profile retrieved successfully",
  "timestamp": "2024-01-15T10:45:00.000Z",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "role": "employee",
      "department": null,
      "position": null,
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

### 5. Update User Profile

**PUT** `/auth/profile`
**Headers:** `Authorization: Bearer YOUR_ACCESS_TOKEN`

```json
{
  "name": "John Smith",
  "phone": "+1987654321",
  "department": "Engineering",
  "position": "Software Developer"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Profile updated successfully",
  "timestamp": "2024-01-15T10:50:00.000Z",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Smith",
      "email": "john.doe@example.com",
      "phone": "+1987654321",
      "role": "employee",
      "department": "Engineering",
      "position": "Software Developer",
      "updated_at": "2024-01-15T10:50:00.000Z"
    }
  }
}
```

### 6. Change Password

**PUT** `/auth/change-password`
**Headers:** `Authorization: Bearer YOUR_ACCESS_TOKEN`

```json
{
  "currentPassword": "SecurePass123!",
  "newPassword": "NewSecurePass456!"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Password changed successfully",
  "timestamp": "2024-01-15T10:55:00.000Z"
}
```

### 7. Logout

**POST** `/auth/logout`
**Headers:** `Authorization: Bearer YOUR_ACCESS_TOKEN`

**Success Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Logout successful",
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

---

## 👥 User Management Endpoints

### 1. Get All Users (Manager+)

**GET** `/users?page=1&limit=10`
**Headers:** `Authorization: Bearer YOUR_ACCESS_TOKEN`

**Success Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Users retrieved successfully",
  "timestamp": "2024-01-15T11:05:00.000Z",
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890",
        "role": "employee",
        "department": "Engineering",
        "position": "Software Developer",
        "is_active": true,
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

### 2. Get User by ID

**GET** `/users/550e8400-e29b-41d4-a716-446655440000`
**Headers:** `Authorization: Bearer YOUR_ACCESS_TOKEN`

**Success Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "User retrieved successfully",
  "timestamp": "2024-01-15T11:10:00.000Z",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "role": "employee",
      "department": "Engineering",
      "position": "Software Developer",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:50:00.000Z"
    }
  }
}
```

### 3. Search Users

**GET** `/users/search?q=john&page=1&limit=10`
**Headers:** `Authorization: Bearer YOUR_ACCESS_TOKEN`

**Success Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "Search completed successfully",
  "timestamp": "2024-01-15T11:15:00.000Z",
  "data": {
    "items": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "phone": "+1234567890",
        "role": "employee",
        "department": "Engineering",
        "position": "Software Developer",
        "is_active": true,
        "created_at": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalItems": 1,
      "itemsPerPage": 10,
      "hasNextPage": false,
      "hasPrevPage": false
    }
  }
}
```

### 4. Update User (Admin Only)

**PUT** `/users/550e8400-e29b-41d4-a716-446655440000`
**Headers:** `Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN`

```json
{
  "name": "John Smith",
  "role": "manager",
  "department": "Engineering",
  "position": "Senior Developer"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "User updated successfully",
  "timestamp": "2024-01-15T11:20:00.000Z",
  "data": {
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Smith",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "role": "manager",
      "department": "Engineering",
      "position": "Senior Developer",
      "updated_at": "2024-01-15T11:20:00.000Z"
    }
  }
}
```

### 5. Deactivate User (Admin Only)

**DELETE** `/users/550e8400-e29b-41d4-a716-446655440000`
**Headers:** `Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN`

**Success Response (200):**
```json
{
  "success": true,
  "status": 200,
  "message": "User deactivated successfully",
  "timestamp": "2024-01-15T11:25:00.000Z"
}
```

---

## 🚨 Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "status": 400,
  "message": "Validation failed",
  "timestamp": "2024-01-15T11:30:00.000Z",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    },
    {
      "field": "password",
      "message": "Password must be between 8 and 128 characters",
      "value": "123"
    }
  ]
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "status": 401,
  "message": "Invalid email or password",
  "timestamp": "2024-01-15T11:35:00.000Z"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "status": 403,
  "message": "Insufficient permissions",
  "timestamp": "2024-01-15T11:40:00.000Z"
}
```

### Not Found (404)
```json
{
  "success": false,
  "status": 404,
  "message": "User not found",
  "timestamp": "2024-01-15T11:45:00.000Z"
}
```

### Too Many Requests (429)
```json
{
  "success": false,
  "status": 429,
  "message": "Too many authentication attempts, please try again later",
  "timestamp": "2024-01-15T11:50:00.000Z"
}
```

---

## 🧪 Testing Tools

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "phone": "+1234567890"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'

# Get profile (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman Collection

Import this collection into Postman:

```json
{
  "info": {
    "name": "HR Backend API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api"
    },
    {
      "key": "accessToken",
      "value": ""
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"TestPass123!\",\n  \"phone\": \"+1234567890\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          }
        }
      ]
    }
  ]
}
```

### Health Check

**GET** `/health`

```json
{
  "status": "OK",
  "timestamp": "2024-01-15T12:00:00.000Z",
  "uptime": 3600
}
```

---

## 📝 Test Scenarios

### 1. Complete User Flow
1. Register a new user
2. Login with credentials
3. Get user profile
4. Update profile
5. Change password
6. Logout

### 2. Role-based Access Testing
1. Create users with different roles (employee, manager, admin)
2. Test access to protected endpoints
3. Verify permission restrictions

### 3. Security Testing
1. Test rate limiting by making multiple requests
2. Test with invalid tokens
3. Test with expired tokens
4. Test input validation with malicious data

### 4. Error Handling
1. Test with missing required fields
2. Test with invalid data types
3. Test with non-existent resources
4. Test with unauthorized access

---

## 🔧 Environment Setup for Testing

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Verify server is running:**
   ```bash
   curl http://localhost:3000/health
   ```

3. **Test with different user roles:**
   - Create employee, manager, and admin accounts
   - Test role-based access to different endpoints

This comprehensive testing guide covers all your API endpoints with examples you can use immediately for testing and validation! 🚀


