import jwt from "jsonwebtoken";

export default function adminMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.status(401).json({ message: "Authorization header required" });

    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;
    if (!token) return res.status(401).json({ message: "Token not provided" });

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET not configured on server");
      return res.status(500).json({ message: "Server misconfiguration: JWT secret missing" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (decoded.role && decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin access required" });
    }

    req.admin = decoded;
    return next();
  } catch (err) {
    console.error("adminMiddleware error:", err?.message || err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
