import { app } from "./src/app.js";
import { PORT, NODE_ENV } from "./src/config/env.config.js";

// Graceful shutdown handler
let server;
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  if (server) {
    server.close(() => {
      console.log("✅ HTTP server closed.");
      process.exit(0);
    });
    // Force exit if not closed within timeout
    setTimeout(() => {
      console.warn("⚠️ Forcing shutdown due to timeout.");
      process.exit(1);
    }, 10000).unref();
  } else {
    process.exit(0);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle termination signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const startServer = async () => {
  try {
    const port = PORT || 3000;
    
    server = app.listen(port, () => {
      console.log(`
🚀 Server is running!
📍 Environment: ${NODE_ENV}
🌐 URL: http://localhost:${port}
⏰ Started at: ${new Date().toISOString()}
      `);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use. Please try a different port.`);
      } else {
        console.error('❌ Server error:', error);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start the server
startServer();