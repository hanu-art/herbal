import { ORIGIN } from "./env.config.js";

const allowedOrigins = [
  ORIGIN,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://herbal-6tab.onrender.com',
  'http://herbal-6tab.onrender.com'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is allowed
    if (allowedOrigins.some(allowedOrigin => 
      origin === allowedOrigin || 
      origin.endsWith('.onrender.com')
    )) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'X-Auth-Token'
  ],
  exposedHeaders: [
    'Content-Length',
    'X-Foo',
    'X-Bar',
    'X-Auth-Token'
  ],
  preflightContinue: false
};

export {
  corsOptions
};