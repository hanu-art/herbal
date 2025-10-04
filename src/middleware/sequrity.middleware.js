import helmet from "helmet";
import { xss } from "express-xss-sanitizer";

export const securityMiddleware = (app) => {
  // Helmet headers for enhanced security
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          "default-src": ["'self'"],
          "script-src": ["'self'"],
          "img-src": ["'self'", "data:", "https:"],
          "style-src": ["'self'", "'unsafe-inline'"],
          "connect-src": ["'self'"],
          "font-src": ["'self'"],
          "object-src": ["'none'"],
          "media-src": ["'self'"],
          "frame-src": ["'none'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      xDownloadOptions: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    })
  );

  // XSS protection
  app.use(xss());
};