import jwt from "jsonwebtoken";
import crypto from "crypto";
import RefreshToken from "../models/RefreshToken.js";

// Short-lived access token — 15 minutes
export const generateAccessToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
};

// Long-lived refresh token — 7 days, stored in DB
export const generateRefreshToken = async (
  adminId,
  userAgent = "",
  ip = "",
) => {
  // Opaque random token — not a JWT
  const token = crypto.randomBytes(64).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await RefreshToken.create({
    token,
    admin: adminId,
    userAgent,
    ip,
    expiresAt,
  });

  return token;
};

// Rotate: revoke old refresh token and issue a new one
export const rotateRefreshToken = async (oldToken, adminId, userAgent, ip) => {
  // Find and revoke in one go, but only if it wasn't already revoked
  const revokedToken = await RefreshToken.findOneAndUpdate(
    { token: oldToken, isRevoked: false },
    { isRevoked: true },
  );

  // If the token was already revoked or doesn't exist, someone might be
  // attempting a "Replay Attack." In a 10/10 system, you'd log a security warning here.
  if (!revokedToken) {
    throw new Error("Invalid or compromised refresh token");
  }

  return generateRefreshToken(adminId, userAgent, ip);
};

// Revoke all refresh tokens for an admin (logout all devices)
export const revokeAllTokens = async (adminId) => {
  await RefreshToken.updateMany(
    { admin: adminId, isRevoked: false },
    { isRevoked: true },
  );
};

// Revoke a single refresh token (logout current device only)
export const revokeSingleToken = async (token) => {
  await RefreshToken.findOneAndUpdate({ token }, { isRevoked: true });
};
