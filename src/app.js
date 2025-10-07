import express from "express";
import { corsOptions } from "./config/corsOptions.config.js";
import cors from 'cors';
import { securityMiddleware } from "./middleware/sequrity.middleware.js";

// Routers
import authRouter from "./router/auth.router.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./router/product.router.js";
import categoryRouter from "./router/category.router.js";
import orderRouter from "./router/order.router.js";

const app = express();

// Security middleware (Helmet & XSS protection)
securityMiddleware(app);

// CORS configuration
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);

// 404 handler - catch all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    status: 404,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  // Handle CORS errors
  if (error.message.includes('CORS policy')) {
    return res.status(403).json({
      status: 403,
      message: 'CORS policy violation',
      error: error.message
    });
  }

  // Handle rate limit errors
  if (error.status === 429) {
    return res.status(429).json({
      status: 429,
      message: 'Too many requests',
      retryAfter: error.retryAfter
    });
  }

  // Default error response
  res.status(error.status || 500).json({
    status: error.status || 500,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

export { app };
