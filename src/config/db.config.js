import mysql2 from 'mysql2/promise';
import { DATABASE, ROOT, DATABASEPORT, HOST, DATABASE_PASSWORD } from './env.config.js';

// Create connection pool
const pool = mysql2.createPool({
  host: HOST,
  database: DATABASE,
  user: ROOT,
  password: DATABASE_PASSWORD,
  port: DATABASEPORT,
  connectionLimit: 10,
  waitForConnections: true,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
  charset: 'utf8mb4'
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
};

// Execute queries with proper error handling
const Queries = async (query, data = []) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.execute(query, data);
    return rows;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

// Initialize database connection
testConnection();

export {
  pool,
  testConnection,
  Queries
};