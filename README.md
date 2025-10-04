# HR Management System Backend

A production-grade Node.js + Express.js backend with Supabase integration for HR management.

## 🚀 Features

- **JWT Authentication** - Access & refresh tokens
- **Role-based Authorization** - Employee, Manager, Admin roles
- **Supabase Integration** - Modern database with real-time capabilities
- **Security First** - Helmet, CORS, XSS protection, rate limiting
- **Input Validation** - Comprehensive validation with express-validator
- **Error Handling** - Standardized error responses
- **Clean Architecture** - MVC pattern with services layer

## 📁 Project Structure

```
src/
├── config/                 # Configuration files
│   ├── corsOptions.config.js
│   ├── env.config.js
│   └── supabaseClient.js
├── controllers/            # Request handlers
│   ├── auth.controller.js
│   └── user.controller.js
├── middleware/             # Custom middleware
│   ├── auth.middleware.js
│   ├── sequrity.middleware.js
│   └── validation/
│       └── validation.middleware.js
├── model/                  # Database models/queries
│   └── userQuery.model.js
├── routes/                 # Route definitions
│   └── user.routes.js
├── router/                 # Legacy routes (to be migrated)
│   └── auth.router.js
├── services/               # Business logic
│   └── user.service.js
├── utils/                  # Utility functions
│   ├── crypto.utils.js
│   ├── jwt.utils.js
│   └── response.utils.js
├── validators/             # Input validation rules
│   └── auth.validator.js
└── app.js                  # Express app configuration
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hr-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.sample .env
   ```
   
   Update `.env` with your configuration (do not commit `.env` to version control):
   ```env
   NODE_ENV=development
   PORT=3000
   ORIGIN=http://localhost:3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   JWT_SECRET=your_jwt_secret_min_32_chars
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📋 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user | No |
| POST | `/login` | User login | No |
| POST | `/refresh-token` | Refresh access token | No |
| POST | `/logout` | User logout | Yes |
| GET | `/profile` | Get user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |
| PUT | `/change-password` | Change password | Yes |

### User Management Routes (`/api/users`)

| Method | Endpoint | Description | Auth Required | Role Required |
|--------|----------|-------------|---------------|---------------|
| GET | `/` | Get all users (paginated) | Yes | Manager+ |
| GET | `/:id` | Get user by ID | Yes | Any |
| GET | `/search?q=term` | Search users | Yes | Any |
| PUT | `/:id` | Update user | Yes | Admin |
| DELETE | `/:id` | Deactivate user | Yes | Admin |

## 🔐 Authentication

### Registration
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+1234567890",
  "role": "employee"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### Response
```json
{
  "success": true,
  "status": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "employee"
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token",
      "expiresIn": "15m"
    }
  }
}
```

## 🛡️ Security Features

- **JWT Tokens**: Short-lived access tokens (15m) + long-lived refresh tokens (7d)
- **Password Hashing**: bcrypt with 12 salt rounds
- **Rate Limiting**: Different limits for auth vs general routes
- **Input Sanitization**: XSS protection on all inputs
- **CORS**: Configurable origin restrictions
- **Helmet**: Security headers
- **Role-based Access**: Granular permission system

## 📊 Database Schema (Supabase)

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password_hash TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'employee',
  department VARCHAR(100),
  position VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
ORIGIN=https://your-frontend-domain
SUPABASE_URL=your_production_supabase_url
SUPABASE_SERVICE_KEY=your_production_service_key
JWT_SECRET=your_secure_jwt_secret_32_chars_minimum
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Related

- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Documentation](https://expressjs.com/)
- [JWT.io](https://jwt.io/)
- [bcrypt Documentation](https://www.npmjs.com/package/bcrypt)


