import { ORIGIN } from "./env.config.js";

const allowedOrigins = [
  ORIGIN, // optional, from .env
  'http://localhost:5173',   // ✅ React local (Vite)
  'http://localhost:3000',   // CRA local
  'http://localhost:3001',
  'https://herbal-6tab.onrender.com', // ✅ Render backend
  'http://herbal-6tab.onrender.com' ,
  'https://herbal-products-frontend.vercel.app/'
];

const corsOptions = {
  origin: function (origin, callback) {
    // ✅ Allow requests without origin (like Postman / curl)
    if (!origin) return callback(null, true);

    // ✅ Allow if origin matches or is from Render
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.onrender.com')
    ) {
      return callback(null, true);
    }

    console.log('❌ Blocked by CORS:', origin);
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

export { corsOptions };
