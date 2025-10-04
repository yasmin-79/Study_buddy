// middleware/auth.js
import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Expect "Bearer <token>"
  if (!token) return res.status(401).json({ message: "Invalid token format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    req.user = decoded; // now you can access req.user.id, req.user.email, etc.
    next();
  } catch (err) {
    console.error("JWT error:", err);
    res.status(403).json({ message: "Invalid or expired token" });
  }
}
