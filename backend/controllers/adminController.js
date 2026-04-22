import Admin from "../models/Admin.js";
import RefreshToken from "../models/RefreshToken.js";
import {
  generateAccessToken,
  generateRefreshToken,
  rotateRefreshToken,
  revokeAllTokens,
  revokeSingleToken,
} from "../utils/generateTokens.js";

/* -------------------------
   REGISTER (Dev only)
------------------------- */
export const registerAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      const error = new Error("Username and password are required");
      error.statusCode = 400;
      throw error;
    }

    if (password.length < 6) {
      const error = new Error("Password must be at least 6 characters");
      error.statusCode = 400;
      throw error;
    }

    const exists = await Admin.findOne({ username });
    if (exists) {
      const error = new Error("Admin already exists");
      error.statusCode = 400;
      throw error;
    }

    // ✅ Password hashing now handled by Admin model pre-save hook
    // No need to hash manually here anymore
    const admin = await Admin.create({ username, password });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      id: admin._id,
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------------
   LOGIN
------------------------- */
export const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      const error = new Error("Username and password are required");
      error.statusCode = 400;
      throw error;
    }

    const admin = await Admin.findOne({ username });

    if (!admin) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // ✅ Check if account is locked
    if (admin.isLocked) {
      const minutesLeft = Math.ceil((admin.lockUntil - Date.now()) / 1000 / 60);
      const error = new Error(
        `Account locked. Try again in ${minutesLeft} minutes.`,
      );
      error.statusCode = 423;
      throw error;
    }

    // ✅ Use model method instead of raw bcrypt.compare
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      // Increment failed attempts and potentially lock account
      await admin.incrementLoginAttempts();
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      throw error;
    }

    // ✅ Reset attempts on successful login
    await admin.resetLoginAttempts();

    // Generate tokens
    const accessToken = generateAccessToken(admin._id);
    const refreshToken = await generateRefreshToken(
      admin._id,
      req.headers["user-agent"] || "",
      req.ip,
    );

    // Send refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      accessToken,
      admin: {
        id: admin._id,
        username: admin.username,
        lastLogin: admin.lastLogin,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------------
   REFRESH TOKEN
------------------------- */
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      const error = new Error("No refresh token");
      error.statusCode = 401;
      throw error;
    }

    // ✅ Look up token in DB instead of just verifying JWT
    const storedToken = await RefreshToken.findOne({ token }).populate("admin");

    if (!storedToken || !storedToken.admin) {
      const error = new Error("Invalid session. Please log in again.");
      error.statusCode = 401;
      throw error;
    }

    // ✅ Detect token reuse — if revoked, kill all sessions
    if (storedToken.isRevoked) {
      await revokeAllTokens(storedToken.admin._id);
      const error = new Error(
        "Token reuse detected. All sessions have been revoked.",
      );
      error.statusCode = 401;
      throw error;
    }

    // ✅ Check expiry
    if (new Date() > storedToken.expiresAt) {
      const error = new Error("Refresh token expired. Please log in again.");
      error.statusCode = 401;
      throw error;
    }

    // ✅ Rotate — revoke old token, issue new one
    const newRefreshToken = await rotateRefreshToken(
      token,
      storedToken.admin._id,
      req.headers["user-agent"] || "",
      req.ip,
    );

    const newAccessToken = generateAccessToken(storedToken.admin._id);

    // Update cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------------
   LOGOUT (current device)
------------------------- */
export const logoutAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;

    if (token) {
      // ✅ Revoke this specific token in DB
      await revokeSingleToken(token);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

/* -------------------------
   LOGOUT ALL DEVICES
------------------------- */
export const logoutAllDevices = async (req, res, next) => {
  try {
    // ✅ Revoke every refresh token for this admin
    await revokeAllTokens(req.admin._id);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({
      success: true,
      message: "Logged out from all devices successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------------
   DASHBOARD STATS
------------------------- */
export const getDashboardStats = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Stats endpoint ready",
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------------
   ACTIVITY LOGS
------------------------- */
export const getActivityLogs = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Activity endpoint ready",
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------------
   PASSWORD MANAGEMENT
------------------------- */
export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    // Fetch admin with password field included
    const admin = await Admin.findById(req.admin._id).select("+password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Verify current password
    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Set new password — pre-save hook will hash it automatically
    admin.password = newPassword;
    await admin.save();

    // Revoke all refresh tokens so other devices are logged out
    await revokeAllTokens(admin._id);

    // Clear cookie on current device
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    res.status(200).json({
      success: true,
      message:
        "Password updated successfully. Please log in again with your new password.",
    });
  } catch (error) {
    next(error);
  }
};
