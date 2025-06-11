const JWT = require("jsonwebtoken");

// Middleware to check if user is signed in
const requireSignIn = (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(200).json({
        success: false,
        message: "Token is required",
      });
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Error in token",
      error,
    });
  }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  try {
    const user = req.user;
    console.log(user);
    console.log(user.role);
    if (user.role === 0) {
      return res.status(200).json({
        success: false,
        message: "You are not an admin",
      });
    } else {
      next();
    }
  } catch (error) {
    return res.status(200).json({
      success: false,
      message: "Error in token",
      error,
    });
  }
};

// ✅ Correct export
module.exports = {
  requireSignIn,
  isAdmin,
};

