import rateLimit from "express-rate-limit";

const createErrorMessage = (message) => {
  return {
    status: 429,
    message: message,
    timestamp: new Date().toISOString()
  };
};

const apiLimiter = rateLimit({
  windowMs: 1000 * 60 * 15, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: createErrorMessage("Too many requests from this IP, please try again later"),
  handler: (req, res) => {
    res.status(429).json(createErrorMessage("Too many requests from this IP, please try again later"));
  }
});

const loginLimiter = rateLimit({
  windowMs: 1000 * 60 * 15, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: createErrorMessage("Too many login attempts from this IP, please try again later"),
  handler: (req, res) => {
    res.status(429).json(createErrorMessage("Too many login attempts from this IP, please try again later"));
  }
});

export {
  apiLimiter,
  loginLimiter
};