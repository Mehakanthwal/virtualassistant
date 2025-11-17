import jwt from "jsonwebtoken";

const isauth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Token not found" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded._id; // ✅ consistent with gentoken
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default isauth;
