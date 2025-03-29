const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const verifyToken = async (req, res, next) => {
  const token = req.cookies.token; // Correct property name

  if (!token) {
    return res.status(401).json({
      success: false, // Fix typo (was true)
      message: "Unauthorized - no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - invalid token",
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Error in verifyToken:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = verifyToken;
