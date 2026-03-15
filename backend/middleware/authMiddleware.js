import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

export const protectAdmin = async (req, res, next) => {
  console.log("Auth header:", req.headers.authorization); // Debugging

  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1]; // Remove "Bearer " prefix
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Optional: fetch admin details
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) return res.status(401).json({ message: "Admin not found" });

    req.admin = admin;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message); // Debugging
    return res.status(401).json({ message: "Invalid token" });
  }
};
