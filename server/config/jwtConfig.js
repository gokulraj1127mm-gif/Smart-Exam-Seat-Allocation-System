const jwt = require("jsonwebtoken");

/**
 * Generate JWT Token
 */
const generateToken = (payload) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/**
 * Verify JWT Token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_SECRET
    );
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};