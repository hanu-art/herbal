import bcrypt from 'bcrypt';
import { Queries } from '../../config/db.config.js';
import { QueryRegistration, registrationCheck } from '../../model/userQuery.model.js';

const userRegistration = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    let { password } = req.body;

    // Input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Name, email, and password are required fields"
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 400,
        message: "Please provide a valid email address"
      });
    }

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        status: 400,
        message: "Password must be at least 6 characters long"
      });
    }

    const saltRounds = 12;
    
    // Check if email already exists
    const existingUser = await Queries(registrationCheck, [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({
        status: 400,
        message: "Email is already registered"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    if (!hashedPassword) {
      throw new Error("Failed to hash password");
    }

    // Prepare data for insertion
    const data = [name, email, hashedPassword, phone || null];
    
    // Insert user into database
    const result = await Queries(QueryRegistration, data);
    
    if (result.affectedRows > 0) {
      res.status(201).json({
        status: 201,
        message: "Registration successful",
        data: {
          id: result.insertId,
          name: name,
          email: email
        }
      });
    } else {
      throw new Error("Failed to create user account");
    }

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error during registration"
    });
  }
};

export {
  userRegistration
};