import dotenv from 'dotenv';
dotenv.config();

// Server configuration
export const PORT = process.env.PORT || 3000;
export const ORIGIN = process.env.ORIGIN || 'http://localhost:3000';
export const NODE_ENV = process.env.NODE_ENV || 'development';

// Database configuration
export const HOST = process.env.DB_HOST || 'localhost';
export const DATABASE = process.env.DB_NAME || 'hr_database';
export const ROOT = process.env.DB_USER || 'root';
export const DATABASE_PASSWORD = process.env.DB_PASSWORD || '';
export const DATABASEPORT = process.env.DB_PORT || 3306;

// Supabase configuration
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// JWT configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
export const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
export const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

// Validate required environment variables
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn(`Warning: Missing required environment variables: ${missingVars.join(', ')}`);
}
