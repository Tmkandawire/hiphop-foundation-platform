import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protectAdmin = async (req, res, next) => {
  // 1. Check for Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Not authorized: No bearer token provided.",
      code: "NO_TOKEN",
    });
  }

  // 2. Extract token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized: Malformed authorization header.",
      code: "NO_TOKEN",
    });
  }

  try {
    // 3. Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Confirm admin still exists in DB
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Authorization failed: Admin no longer exists.",
        code: "TOKEN_INVALID",
      });
    }

    // 5. Check if account is locked
    if (admin.isLocked) {
      const minutesLeft = Math.ceil((admin.lockUntil - Date.now()) / 1000 / 60);
      return res.status(403).json({
        success: false,
        message: `Access denied: Account locked. Try again in ${minutesLeft} minutes.`,
        code: "ACCOUNT_LOCKED",
      });
    }

    // 6. Attach admin to request
    req.admin = admin;
    req.user = admin;
    next();
  } catch (error) {
    // 7. Handle JWT-specific errors
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please refresh your token.",
        code: "TOKEN_EXPIRED",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Not authorized: Invalid token signature.",
        code: "TOKEN_INVALID",
      });
    }

    if (error.name === "NotBeforeError") {
      return res.status(401).json({
        success: false,
        message: "Token not yet active.",
        code: "TOKEN_INVALID",
      });
    }

    // 8. Unexpected errors go to global error handler
    next(error);
  }
};
